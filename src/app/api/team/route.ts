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

/** Chỉ hiển thị đội ngũ được bot xác nhận từ máy chủ cộng đồng đã cấu hình. */
export async function GET() {
  try {
    const result = await callMimiApi<{ ok: boolean; team: TeamMember[] }>('/internal/team');
    if (result.ok && result.data?.ok && Array.isArray(result.data.team)) {
      const team = result.data.team.map((member) => {
        // Bot cũ có thể chưa trả group, chỉ suy luận từ vai trò thật trong phản hồi.
        const role = String(member.role || '');
        const group: TeamMember['group'] = ['core', 'admin', 'partner', 'community'].includes(member.group)
          ? member.group
          : /founder/i.test(role) || member.isDev ? 'core'
          : /partner|đối tác/i.test(role) ? 'partner'
          : /admin|quản trị|manager|mod/i.test(role) ? 'admin' : 'community';
        return { ...member, group, status: ['online', 'idle', 'dnd', 'offline'].includes(member.status) ? member.status : 'unknown' };
      });
      return NextResponse.json({ ok: true, team, source: 'discord_roles' });
    }
  } catch {
    // Kết nối lỗi không được tạo thành viên hoặc trạng thái trực tuyến giả.
  }
  return NextResponse.json({ ok: false, team: [], source: 'unavailable', error: 'Chưa tải được đội ngũ từ Discord.' }, { status: 503 });
}
