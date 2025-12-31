
import OpenAI from "openai";

// ========================================
// P0 修复: 超时控制工具函数
// ========================================
const DEFAULT_TIMEOUT_MS = 10000; // 10秒默认超时

interface FetchWithTimeoutOptions extends RequestInit {
  timeoutMs?: number;
}

/**
 * 带超时控制的 fetch 封装
 * @param url 请求 URL
 * @param options 请求选项，可额外指定 timeoutMs
 * @returns Promise<Response>
 * @throws Error 超时或网络错误时抛出异常
 */
async function fetchWithTimeout(
  url: string,
  options: FetchWithTimeoutOptions = {}
): Promise<Response> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, ...fetchOptions } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    return response;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout after ${timeoutMs}ms: ${url}`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

// OpenRouter Client
// 使用 OpenRouter 访问各类 LLM (Claude, GPT-4, Llama等)
export const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "dummy-key-for-build",
  defaultHeaders: {
    "HTTP-Referer": "https://marketing-agent.local", // Optional, for including your app on openrouter.ai rankings.
    "X-Title": "Marketing Agent", // Optional. Shows in rankings on openrouter.ai.
  },
  // P0: OpenAI SDK 有内置超时，但可在此处配置
  timeout: 30000, // 30秒超时
});

// Search Client (Serper / Tavily)
// P0 修复: 添加超时控制
export const searchClient = {
  async search(query: string, type: 'search' | 'news' = 'search', timeoutMs = DEFAULT_TIMEOUT_MS) {
    const apiKey = process.env.SERPER_API_KEY;
    if (!apiKey) {
      console.warn("Missing SERPER_API_KEY");
      // Fallback or throw based on requirements
      return null;
    }

    const url = `https://google.serper.dev/${type}`;
    
    const response = await fetchWithTimeout(url, {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ q: query, gl: 'cn', hl: 'zh-cn' }),
      timeoutMs,
    });

    if (!response.ok) {
      throw new Error(`Search API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
};

// Scraping Client (Firecrawl)
// P0 修复: 添加超时控制
export const scrapingClient = {
  async scrape(url: string, timeoutMs = 15000) { // 爬取可能需要更长时间，默认15秒
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) {
        console.warn("Missing FIRECRAWL_API_KEY");
        return null;
    }
    
    // Firecrawl /scrape endpoint
    const apiUrl = "https://api.firecrawl.dev/v0/scrape";
    
    const response = await fetchWithTimeout(apiUrl, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ url, pageOptions: { onlyMainContent: true } }),
        timeoutMs,
    });

    if (!response.ok) {
         throw new Error(`Scraping API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  }
};
