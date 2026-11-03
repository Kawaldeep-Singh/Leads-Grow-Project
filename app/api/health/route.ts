import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'LeadsGrow Unified Next.js API',
    timestamp: new Date().toISOString(),
  });
}
