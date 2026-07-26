import { NextResponse } from 'next/server';
import { env } from '@/lib/env';

export async function GET(
  request: Request,
  { params }: { params: { guildId: string } }
) {
  const { guildId } = params;

  try {
    const url = `${env.MIMI_API_HOST}:${env.MIMI_API_PORT}/api/guilds/${guildId}/player`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${env.MIMI_API_TOKEN}`,
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Không thể kết nối đến Bot Internal API', status: res.status },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      {
        error: 'Bot Internal API chưa trực tuyến hoặc sai cổng kết nối',
        details: err.message,
      },
      { status: 503 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { guildId: string } }
) {
  const { guildId } = params;

  try {
    const body = await request.json();
    const url = `${env.MIMI_API_HOST}:${env.MIMI_API_PORT}/api/guilds/${guildId}/player`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.MIMI_API_TOKEN}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: 'Không thể gửi lệnh điều khiển tới Bot',
        details: err.message,
      },
      { status: 503 }
    );
  }
}
