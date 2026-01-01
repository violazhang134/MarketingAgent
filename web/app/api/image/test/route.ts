import { NextResponse } from 'next/server';
import { testConnection } from '@/lib/api/image-gen';

// ========================================
// 测试 API 连接
// GET /api/image/test
// ========================================

export async function GET() {
  const result = await testConnection();
  return NextResponse.json(result);
}
