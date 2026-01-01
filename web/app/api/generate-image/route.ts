// ========================================
// 图片生成 API Route
// POST /api/generate-image
// 支持：文生图 + 图生图（所有工具）
// ========================================

import { NextRequest, NextResponse } from 'next/server';

const API_BASE = 'https://api.302.ai';
const MODEL = process.env.SEEDREAM_MODEL || 'doubao-seedream-4-5-251128';

// Seedream 支持的尺寸
type SeedreamSize = '1K' | '2K' | '4K' | '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      prompt, 
      negativePrompt, 
      size = '2K', 
      watermark = false,
      toolId,
      referenceImage,  // base64 图片
      image_url,       // Reference Image URL (New)
      strength,        // 变化强度 (0-1)
      // 其他工具特定参数可在此扩展
    } = body;

    // Seedream High-Res Size Mapping
    const SIZE_MAP: Record<string, string> = {
      '1:1': '2048x2048',
      '16:9': '2560x1440',
      '9:16': '1440x2560',
      '4:3': '2048x1536',
      '3:4': '1536x2048',
      '1K': '1024x1024', // Legacy support
      '2K': '2048x2048',
    };

    const finalSize = SIZE_MAP[size as string] || size;

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: '缺少 prompt 参数' },
        { status: 400 }
      );
    }

    const apiKey = process.env.API_302_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'API Key 未配置' },
        { status: 500 }
      );
    }

    // 根据工具类型构建增强提示词
    let enhancedPrompt = prompt;
    
    if (toolId && referenceImage) {
      // 图生图类工具：增强提示词
      const toolEnhancers: Record<string, string> = {
        variation: '保持参考图构图特征，生成风格变体',
        pixel: '转换为精准像素艺术风格',
        detail: '增强细节和纹理精度',
        upscale: '高清无损放大，补充细节',
        outpaint: '扩展画布，AI 智能补全',
        cutout: '提取主体，移除背景',
        lineart: '提取清晰线稿',
        refine: '局部精细优化',
        erase: '智能修复擦除区域',
        replace: '替换选中区域内容',
      };
      
      if (toolEnhancers[toolId]) {
        enhancedPrompt = `${toolEnhancers[toolId]}。${prompt}`;
      }
    }

    // 添加负面提示词
    const fullPrompt = enhancedPrompt + (negativePrompt ? `。排除: ${negativePrompt}` : '');

    console.log(`[ImageGen] Tool: ${toolId || 'text2img'}, Prompt: ${fullPrompt.substring(0, 50)}...`);

    // 构建 API 请求体
    const apiBody: Record<string, unknown> = {
      model: MODEL,
      prompt: fullPrompt,
      size: finalSize,
      watermark: watermark,
    };
    
    // Inject reference image (Seedream 4.5 spec: 'image' is array of strings)
    // Doc: https://doc.302.ai/385925488e0
    if (image_url) {
      // API expects "image": ["url1", "url2"]
      apiBody.image = [image_url];
    }

    // 如果有参考图片，使用图生图端点（如果 API 支持）
    // 注意：Seedream 文生图 API 可能不直接支持 img2img，这里将参考图信息加入提示词
    if (referenceImage && strength !== undefined) {
      // 将 strength 信息加入提示词（API 适配层处理）
      apiBody.prompt = `参考强度${Math.round(strength * 100)}%。${fullPrompt}`;
    }

    // 调用 Seedream API
    const response = await fetch(`${API_BASE}/doubao/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(apiBody),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[ImageGen] API Error:', data);
      return NextResponse.json(
        { success: false, error: data.error?.message || JSON.stringify(data) },
        { status: response.status }
      );
    }

    // 提取图片 URL 并下载保存到本地
    const remoteImages = data.data?.map((item: { url?: string }) => item.url).filter(Boolean) || [];
    const localImages: string[] = [];
    
    // Ensure directory exists
    const fs = await import('fs');
    const path = await import('path');
    const saveDir = path.join(process.cwd(), 'public/generated/images');
    if (!fs.existsSync(saveDir)) {
      fs.mkdirSync(saveDir, { recursive: true });
    }

    // Log to file for "history" check
    const logFile = path.join(process.cwd(), 'public/generated/image_gen.log');
    const logEntry = `[${new Date().toISOString()}] Prompt: "${fullPrompt.substring(0, 30)}..." | Size: ${finalSize} | Status: Success | Count: ${remoteImages.length}\n`;
    fs.appendFileSync(logFile, logEntry);

    for (const remoteUrl of remoteImages) {
      try {
        const imageRes = await fetch(remoteUrl);
        if (!imageRes.ok) throw new Error(`Failed to fetch image: ${imageRes.statusText}`);
        
        const arrayBuffer = await imageRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
        const filepath = path.join(saveDir, filename);
        
        fs.writeFileSync(filepath, buffer);
        localImages.push(`/generated/images/${filename}`);
        console.log(`[ImageGen] Saved local image: ${filepath}`);
      } catch (err) {
        console.error('[ImageGen] Failed to save local image:', err);
        // Fallback to remote URL if save fails
        localImages.push(remoteUrl);
      }
    }

    console.log('[ImageGen] Success, generated', localImages.length, 'images locally');

    return NextResponse.json({
      success: true,
      images: localImages, // Return local paths for UI display
      remoteImages: remoteImages, // Return remote URLs for workflow consistency (img2img)
      model: data.model,
      usage: data.usage,
      toolId,
    });
  } catch (error) {
    console.error('[ImageGen] Error:', error);
    // Log error to file
    try {
        const fs = await import('fs');
        const path = await import('path');
        const logFile = path.join(process.cwd(), 'public/generated/image_gen.log');
        fs.appendFileSync(logFile, `[${new Date().toISOString()}] Error: ${error instanceof Error ? error.message : String(error)}\n`);
    } catch {}
    
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
}
