'use client';

import { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import type { TeamMember } from '@/app/api/team/route';
import { partitionTeamMembers } from '@/lib/team-spotlights';
import { MotionReveal } from '@/components/ui/motion-primitives';
import { MemberAvatar, TeamSpotlight } from './team-spotlight';
import './team.css';

export function TeamSection() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [source, setSource] = useState<'loading' | 'ready' | 'unavailable'>('loading');

  useEffect(() => {
    const controller = new AbortController();
    async function loadTeam() {
      try {
        const response = await fetch('/api/team', { signal: controller.signal });
        const data = await response.json();
        if (!response.ok || !data.ok || !Array.isArray(data.team)) throw new Error('Team unavailable');
        setTeam(data.team);
        setSource('ready');
      } catch {
        if (!controller.signal.aborted) setSource('unavailable');
      }
    }
    void loadTeam();
    return () => controller.abort();
  }, []);

  const { featured, remaining } = partitionTeamMembers(team);

  return (
    <section id="doi-ngu" className="team-section py-24 md:py-32" aria-labelledby="team-heading">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <MotionReveal variant="mask" className="team-heading">
          <p className="team-eyebrow">Những người làm nên Mimi</p>
          <h2 id="team-heading">Đứng sau từng <span>kết nối.</span></h2>
          <p>Từ người đặt nền móng đến người phát triển dự án — cùng một tâm huyết dành cho cộng đồng.</p>
        </MotionReveal>

        {source === 'loading' && <p className="team-state" role="status">Đang kết nối với đội ngũ Mimi…</p>}
        {source === 'unavailable' && <p className="team-state" role="status">Chưa tải được đội ngũ từ Discord. Bạn vui lòng quay lại sau.</p>}
        {source === 'ready' && !featured.length && !remaining.length && <p className="team-state">Chưa có thành viên đội ngũ được cấu hình.</p>}

        {featured.length > 0 && (
          <div className="team-spotlights">
            {featured.map(({ kind, member }, index) => (
              <MotionReveal key={member.id} variant={kind === 'founder' ? 'clip' : 'flip'} delay={index * 0.12} amount={0.08}>
                <TeamSpotlight kind={kind} member={member} />
              </MotionReveal>
            ))}
          </div>
        )}

        {remaining.length > 0 && (
          <div className="team-community">
            <div className="team-community-heading"><ShieldCheck size={18} aria-hidden="true" /><h3>Cùng xây dựng cộng đồng</h3><span>{remaining.length} thành viên</span></div>
            <div className="team-community-grid">
              {remaining.map(member => (
                <a key={member.id} className="team-member" href={`https://discord.com/users/${member.id}`} target="_blank" rel="noopener noreferrer" aria-label={`Xem hồ sơ Discord của ${member.name}`}>
                  <MemberAvatar member={member} />
                  <div><h4>{member.name}</h4><p>{member.role}</p></div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
