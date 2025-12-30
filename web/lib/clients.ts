
import OpenAI from "openai";

// OpenRouter Client
// 使用 OpenRouter 访问各类 LLM (Claude, GPT-4, Llama等)
export const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "dummy-key-for-build",
  defaultHeaders: {
    "HTTP-Referer": "https://marketing-agent.local", // Optional, for including your app on openrouter.ai rankings.
    "X-Title": "Marketing Agent", // Optional. Shows in rankings on openrouter.ai.
  },
  // 在非 Edge Runtime 下可以直接使用，如果是 Edge Runtime 需要确认 fetch 配置
});

// Search Client (Serper / Tavily)
// 简单的 fetch wrapper，方便后续统一处理错误
export const searchClient = {
  async search(query: string, type: 'search' | 'news' = 'search') {
    const apiKey = process.env.SERPER_API_KEY;
    if (!apiKey) {
      console.warn("Missing SERPER_API_KEY");
      // Fallback or throw based on requirements
      return null;
    }

    const url = `https://google.serper.dev/${type}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ q: query, gl: 'cn', hl: 'zh-cn' }) // 默认搜索中国区中文结果，可根据需要调整
    });

    if (!response.ok) {
      throw new Error(`Search API error: ${response.statusText}`);
    }

    return response.json();
  }
};

// Scraping Client (Firecrawl)
export const scrapingClient = {
  async scrape(url: string) {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) {
        console.warn("Missing FIRECRAWL_API_KEY");
        return null;
    }
    
    // Firecrawl /scrape endpoint
    const apiUrl = "https://api.firecrawl.dev/v0/scrape";
    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ url, pageOptions: { onlyMainContent: true } })
    });

    if (!response.ok) {
         throw new Error(`Scraping API error: ${response.statusText}`);
    }
    
    return response.json();
  }
};
