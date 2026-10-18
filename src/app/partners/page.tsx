'use client';

import React, { useEffect, useState } from 'react';
import { MotionReveal } from '@/components/ui/motion-primitives';
import { ShieldCheck, Handshake, Users, Zap, Ticket, BarChart3, Radio, Crown, Hash } from 'lucide-react';
import type { TeamMember } from '@/app/api/team/route';
import type { CommunitySummary } from '@/app/api/communities/route';

export default function PartnersPage() {
  const [partners, setPartners] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const [communities, setCommunities] = useState<CommunitySummary[]>([]);
  const [communityLoading, setCommunityLoading] = useState(true);
  const [communityUnavailable, setCommunityUnavailable] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    async function loadTeam() {
      try {
        const res = await fetch('/api/team', { cache: 'no-store', signal: controller.signal });
        const data = await res.json();
        if (!controller.signal.aborted && res.ok && data?.ok && Array.isArray(data.team)) {
          const partnerList = data.team.filter((m: TeamMember) => m.group === 'partner');
          setPartners(partnerList);
        } else if (!controller.signal.aborted) {
          setUnavailable(true);
        }
      } catch {
        if (!controller.signal.aborted) setUnavailable(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    loadTeam();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/communities', { cache: 'no-store', signal: controller.signal })
      .then(async (res) => {
        const data = await res.json();
        if (!controller.signal.aborted && res.ok && data?.ok && Array.isArray(data.communities)) setCommunities(data.communities);
        else if (!controller.signal.aborted) setCommunityUnavailable(true);
      })
      .catch(() => { if (!controller.signal.aborted) setCommunityUnavailable(true); })
      .finally(() => { if (!controller.signal.aborted) setCommunityLoading(false); });
    return () => controller.abort();
  }, []);

  return (
    <div className="min-h-screen pt-12 pb-24">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <MotionReveal variant="mask" className="page-intro space-y-4">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-mimi-green">
            <Handshake className="h-4 w-4" />
            <span>Cộng Đồng Sử Dụng Bot</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Cộng đồng và <span className="text-mimi-green">đối tác Mimi</span>
          </h1>
          <p className="text-lg text-gray-400">
            Danh sách cá nhân và cộng đồng đối tác được cung cấp từ dữ liệu đội ngũ Mimi.
          </p>
        </MotionReveal>

        <section aria-labelledby="linked-communities" className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-mimi-green"><Radio className="h-3.5 w-3.5" /> Dữ liệu Discord trực tiếp</p>
              <h2 id="linked-communities" className="mt-2 text-2xl font-extrabold text-white">Cộng đồng đang kết nối với Mimi</h2>
              {communities.length > 0 && <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-400"><Hash className="h-3.5 w-3.5 text-mimi-cyan" /> {communities.length} server đang được hiển thị cùng chủ server</p>}
            </div>
            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-gray-400">Cập nhật tự động từ bot</span>
          </div>
          {communityLoading ? (
            <div className="h-28 animate-pulse rounded-3xl border border-white/10 bg-white/[0.03]" />
          ) : communities.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm text-gray-400">
              {communityUnavailable ? 'Bot chưa phản hồi dữ liệu cộng đồng. Vui lòng thử lại sau.' : 'Chưa có server nào được chủ bot cho phép hiển thị công khai.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {communities.map((community, idx) => (
                <MotionReveal key={community.id} variant="flip" delay={idx * 0.08}>
                  <article className="glass-panel card-lift h-full rounded-3xl p-5 transition-[border-color,box-shadow,transform] hover:border-mimi-green/40">
                    <div className="flex items-center gap-4">
                      {community.iconUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={community.iconUrl} alt="" className="h-14 w-14 rounded-2xl border border-white/10 object-cover" />
                      ) : (
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-mimi-green/30 bg-mimi-green/10 text-xl font-black text-mimi-green">{community.name.charAt(0)}</div>
                      )}
                      <div className="min-w-0">
                        <h3 className="truncate font-bold text-white">{community.name}</h3>
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-400"><Users className="h-3.5 w-3.5" /> {community.memberCount.toLocaleString('vi-VN')} thành viên</p>
                      </div>
                    </div>
                    <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[11px]">
                      <div className="rounded-xl bg-white/[0.04] p-2"><strong className="block text-sm text-mimi-green">{community.onlineCount ?? '—'}</strong><span className="text-gray-500">đang online</span></div>
                      <div className="rounded-xl bg-white/[0.04] p-2"><strong className="block text-sm text-mimi-amber">{community.boostCount}</strong><span className="text-gray-500">boost</span></div>
                      <div className="rounded-xl bg-white/[0.04] p-2"><strong className="block text-sm text-mimi-cyan">{community.id.slice(-4)}</strong><span className="text-gray-500">server ID</span></div>
                    </div>
                    <div className="mt-4 flex min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-black/15 px-3 py-2">
                      {community.owner?.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={community.owner.avatarUrl} alt="" className="h-7 w-7 shrink-0 rounded-full object-cover" />
                      ) : (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-mimi-amber/10 text-mimi-amber"><Crown className="h-3.5 w-3.5" /></div>
                      )}
                      <div className="min-w-0">
                        <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500"><Crown className="h-3 w-3 text-mimi-amber" /> Chủ server</p>
                        <p className="truncate text-xs font-semibold text-gray-200" title={community.owner?.id || undefined}>{community.owner?.displayName || community.owner?.username || 'Chưa xác định'}{community.owner?.username && community.owner.username !== community.owner.displayName ? <span className="ml-1 font-normal text-gray-500">@{community.owner.username}</span> : null}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-gray-400">
                      {community.features.music && <span className="inline-flex items-center gap-1 rounded-full bg-mimi-green/10 px-2 py-1 text-mimi-green"><Zap className="h-3 w-3" /> Nhạc</span>}
                      {community.features.ticket && <span className="inline-flex items-center gap-1 rounded-full bg-mimi-purple/10 px-2 py-1 text-mimi-violet"><Ticket className="h-3 w-3" /> Ticket</span>}
                      {community.features.level && <span className="inline-flex items-center gap-1 rounded-full bg-mimi-cyan/10 px-2 py-1 text-mimi-cyan"><BarChart3 className="h-3 w-3" /> Level</span>}
                    </div>
                  </article>
                </MotionReveal>
              ))}
            </div>
          )}
        </section>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-yellow-500" />
          </div>
        ) : partners.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center space-y-4 rounded-3xl border border-white/5 bg-white/[0.02]">
            <p role="status" className="text-gray-400">{unavailable ? 'Chưa tải được danh sách đối tác. Hãy thử lại sau.' : 'Chưa có đối tác nào được hiển thị.'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((partner, idx) => (
              <MotionReveal key={partner.id} variant="scale" delay={idx * 0.1}>
                <div className="glass-panel card-lift group relative flex flex-col items-center overflow-hidden rounded-[2rem] p-6 text-center transition-[border-color,box-shadow] duration-500 hover:border-yellow-500/40 hover:shadow-[0_0_40px_rgba(234,179,8,0.15)] sm:p-8">
                  {/* Glowing background behind avatar */}
                  <div className="absolute left-1/2 top-16 sm:top-20 h-32 w-32 -translate-x-1/2 rounded-full bg-yellow-500/20 blur-[50px] transition-colors ease-[cubic-bezier(0.16,1,0.3,1)] duration-500 group-hover:bg-yellow-500/40" />
                  
                  <div className="relative mb-6 h-28 w-28 shrink-0 overflow-hidden rounded-2xl border-[3px] border-yellow-500/50 shadow-[0_0_25px_rgba(234,179,8,0.2)] transition-transform duration-500 group-hover:scale-110 group-hover:border-yellow-400">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={partner.avatar || '/logo.webp'}
                      alt={partner.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/logo.webp';
                      }}
                    />
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/20" />
                  </div>

                  <h3 className="mb-2 text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                    {partner.name}
                  </h3>
                  
                  <div className="mb-4 inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-bold text-gray-300">
                    <ShieldCheck className="h-3.5 w-3.5 text-yellow-500" />
                    <span style={{ color: partner.color || '#f1c40f' }}>{partner.role}</span>
                  </div>

                  <p className="text-sm leading-relaxed text-gray-400">
                    {partner.description}
                  </p>
                </div>
              </MotionReveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
