'use client';

import { ArrowUpRight, Code2, Crown, GitBranch, Terminal } from 'lucide-react';
import type { TeamMember } from '@/app/api/team/route';
import type { TeamSpotlightKind } from '@/lib/team-spotlights';

export function MemberAvatar({ member }: { member: TeamMember }) {
  return (
    // Discord supplies the avatar URL; a native image also handles external CDN hosts.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={member.avatar || '/logo.webp'} alt={`Ảnh đại diện ${member.name}`} width={160} height={160} loading="lazy" onError={event => {
      if (event.currentTarget.dataset.fallback) return;
      event.currentTarget.dataset.fallback = 'true';
      event.currentTarget.src = '/logo.webp';
    }} />
  );
}

function ProfileLink({ member }: { member: TeamMember }) {
  return <a className="team-profile-link" href={`https://discord.com/users/${member.id}`} target="_blank" rel="noopener noreferrer" aria-label={`Xem hồ sơ Discord của ${member.name}`}>Gặp trên Discord <ArrowUpRight size={17} aria-hidden="true" /></a>;
}

export function TeamSpotlight({ kind, member }: { kind: TeamSpotlightKind; member: TeamMember }) {
  if (kind === 'founder') {
    return (
      <article className="team-honor team-founder" data-team-spotlight="founder" data-member-id={member.id} aria-labelledby={`honor-${member.id}`}>
        <div className="founder-halo" aria-hidden="true"><span /><span /></div>
        <div className="team-honor-top"><span>Mimi / Nhà sáng lập</span><Crown size={22} strokeWidth={1.4} aria-hidden="true" /></div>
        <div className="founder-identity">
          <div className="founder-portrait"><MemberAvatar member={member} /><span><Crown size={16} aria-hidden="true" /></span></div>
          <div className="team-identity-copy"><p className="team-role-label">Owner · Founder</p><h3 id={`honor-${member.id}`}>{member.name}</h3><p className="team-username">@{member.username}</p></div>
        </div>
        <div className="founder-message"><p>Người đặt nền móng.<br /><span>Người kết nối cộng đồng.</span></p></div>
        <p className="founder-description">Tầm nhìn khởi đầu một dự án.<br />Tâm huyết đưa Mimi đến với mọi người.</p>
        <footer className="team-honor-footer"><span>Tầm nhìn & cộng đồng</span><ProfileLink member={member} /></footer>
      </article>
    );
  }

  return (
    <article className="team-honor team-developer" data-team-spotlight="developer" data-member-id={member.id} aria-labelledby={`honor-${member.id}`}>
      <div className="developer-blueprint" aria-hidden="true" />
      <div className="developer-toolbar"><span><Terminal size={15} aria-hidden="true" /> mimi / behind-the-code</span><Code2 size={19} aria-hidden="true" /></div>
      <div className="developer-identity">
        <div className="team-identity-copy"><p className="team-role-label">Developer · Người phát triển</p><h3 id={`honor-${member.id}`}>{member.name}</h3><p className="team-username">@{member.username}</p></div>
        <div className="developer-portrait"><MemberAvatar member={member} /><span><Code2 size={16} aria-hidden="true" /></span></div>
      </div>
      <div className="developer-console"><p className="developer-command"><span aria-hidden="true">$</span> behind_the_project</p><p><span className="console-line" aria-hidden="true">01</span>Ý tưởng <span className="console-arrow">→</span> dòng code.</p><p><span className="console-line" aria-hidden="true">02</span>Dòng code <span className="console-arrow">→</span> trải nghiệm.</p><div className="developer-signature"><Code2 size={15} aria-hidden="true" /><span>Người đứng sau dự án Mimi</span><i aria-hidden="true" /></div></div>
      <div className="developer-note"><GitBranch size={18} aria-hidden="true" /><p>Xây dựng, hoàn thiện.<br /><span>Để mỗi kết nối tốt hơn.</span></p></div>
      <footer className="team-honor-footer"><span>Phát triển & trải nghiệm</span><ProfileLink member={member} /></footer>
    </article>
  );
}
