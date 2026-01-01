// ========================================
// Image Generation API
// 职责: 抽象图片生成接口，支持 302.ai Seedream
// ========================================

// ========================================
// 类型定义
// ========================================

export interface ImageGenRequest {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  count?: number;
}

export interface ImageGenResponse {
  success: boolean;
  images: string[];  // base64 或 URL
  error?: string;
}

export interface Img2ImgRequest extends ImageGenRequest {
  referenceImage: string;  // base64
  strength: number;        // 0-1
}

// ========================================
// API 配置
// ========================================
const API_BASE = 'https://api.302.ai';
const MODEL = 'doubao-seedream-4-5-251128';

// ========================================
// 文生图 API
// ========================================
export async function textToImage(request: ImageGenRequest): Promise<ImageGenResponse> {
  const apiKey = process.env.API_302_KEY;
  
  if (!apiKey) {
    return {
      success: false,
      images: [],
      error: 'API Key 未配置',
    };
  }

  try {
    const response = await fetch(`${API_BASE}/v1/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        prompt: request.prompt,
        negative_prompt: request.negativePrompt || '',
        n: request.count || 1,
        size: `${request.width || 1024}x${request.height || 1024}`,
        response_format: 'b64_json',  // 返回 base64
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        images: [],
        error: errorData.error?.message || `HTTP ${response.status}`,
      };
    }

    const data = await response.json();
    
    // 提取图片（OpenAI 格式返回）
    const images = data.data?.map((item: { b64_json?: string; url?: string }) => 
      item.b64_json ? `data:image/png;base64,${item.b64_json}` : item.url
    ).filter(Boolean) || [];

    return {
      success: true,
      images,
    };
  } catch (error) {
    return {
      success: false,
      images: [],
      error: error instanceof Error ? error.message : '未知错误',
    };
  }
}

// ========================================
// 图生图 API (待 302.ai 支持后实现)
// ========================================
export async function imageToImage(request: Img2ImgRequest): Promise<ImageGenResponse> {
  // 目前 302.ai Seedream 可能不支持 img2img
  // 可以通过添加参考图到 prompt 或使用其他模型实现
  
  // 暂时使用文生图 + 提示词方式模拟
  return textToImage({
    prompt: request.prompt,
    negativePrompt: request.negativePrompt,
    width: request.width,
    height: request.height,
    count: request.count,
  });
}

// ========================================
// 测试连接
// ========================================
export async function testConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const result = await textToImage({
      prompt: '一只可爱的橘猫，Q版卡通风格，白色背景',
      width: 512,
      height: 512,
      count: 1,
    });

    if (result.success && result.images.length > 0) {
      return { success: true, message: `连接成功，生成了 ${result.images.length} 张图片` };
    } else {
      return { success: false, message: result.error || '生成失败' };
    }
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : '连接失败' };
  }
}
