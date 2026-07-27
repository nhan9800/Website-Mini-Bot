import { NextResponse } from 'next/server';
import { callMimiApi } from '@/lib/mimi-api';

export const dynamic = 'force-dynamic';

export interface TeamMember {
  id: string;
  name: string;
  username: string;
  role: string;
  color: string;
  avatar: string | null;
  status: string;
  description: string;
  isDev: boolean;
}

const FALLBACK_TEAM: TeamMember[] = [
  {
    id: '1',
    name: 'nhan9800',
    username: 'nhan9800',
    role: 'Founder & Developer',
    color: '#2ecc71',
    avatar: 'https://github.com/nhan9800.png',
    status: 'online',
    description: 'Xây dựng toàn bộ bot core, Internal API và hệ sinh thái web của MIMI.',
    isDev: true,
  },
  {
    id: '2',
    name: 'Cộng Đồng MIMI',
    username: 'mimi_community',
    role: 'Tester & Support',
    color: '#9b59b6',
    avatar: '/logo.webp',
    status: 'online',
    description:
      'Báo lỗi, góp ý tính năng và hỗ trợ thành viên mới mỗi ngày trên server Discord chính thức.',
    isDev: false,
  },
];

/**
 * Proxy: GET /api/team -> GET {bot}/internal/team
 * Nhận diện đội ngũ dev/support dựa trên các role setup trong server Discord.
 */
export async function GET() {
  try {
    const result = await callMimiApi<{ ok: boolean; team: TeamMember[] }>('/internal/team');

    if (result.ok && result.data?.team && result.data.team.length > 0) {
      return NextResponse.json({
        ok: true,
        team: result.data.team,
        source: 'discord_roles',
      });
    }
  } catch (err) {
    // Không kết nối được bot -> fallback
  }

  return NextResponse.json({
    ok: true,
    team: FALLBACK_TEAM,
    source: 'fallback_roles',
  });
}
