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
  group: 'core' | 'admin' | 'partner' | 'community';
}

const FALLBACK_TEAM: TeamMember[] = [
  {
    id: '1',
    name: 'Mimi',
    username: 'mi.mi2301',
    role: 'Founder & Community Owner',
    color: '#ff6b81',
    avatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=MimiFounder&backgroundColor=ff6b81',
    status: 'online',
    description: 'Sáng lập hệ sinh thái MIMI, định hướng phát triển và kết nối cộng đồng yêu âm nhạc.',
    isDev: false,
    group: 'core',
  },
  {
    id: '2',
    name: 'nhan9800',
    username: 'nhan9800',
    role: 'Core Developer',
    color: '#2ecc71',
    avatar: 'https://github.com/nhan9800.png',
    status: 'online',
    description: 'Phát triển kiến trúc Core Bot, hệ thống Internal API thời gian thực và Website MIMI.',
    isDev: true,
    group: 'core',
  },
  {
    id: '3',
    name: 'Mimi Admin Team',
    username: 'mimi_admin',
    role: 'Community Admin',
    color: '#3498db',
    avatar: '/logo.webp',
    status: 'online',
    description: 'Quản trị máy chủ, điều phối hoạt động sự kiện và hỗ trợ giải đáp thắc mắc của thành viên.',
    isDev: false,
    group: 'admin',
  },
  {
    id: '4',
    name: 'Cộng Đồng MIMI',
    username: 'mimi_community',
    role: 'Tester & Support',
    color: '#9b59b6',
    avatar: '/logo.webp',
    status: 'online',
    description:
      'Báo cáo lỗi, đề xuất tính năng mới và cùng xây dựng môi trường âm nhạc sôi động trên Discord.',
    isDev: false,
    group: 'community',
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
