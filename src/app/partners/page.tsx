'use client';

import React, { useEffect, useState } from 'react';
import { Reveal } from '@/components/ui/reveal';
import { ShieldCheck, Handshake } from 'lucide-react';
import type { TeamMember } from '@/app/api/team/route';

export default function PartnersPage() {
  const [partners, setPartners] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeam() {
      try {
        const res = await fetch('/api/team', { cache: 'no-store' });
        const data = await res.json();
        if (data?.ok && data.team && data.team.length > 0) {
          const partnerList = data.team.filter((m: TeamMember) => m.group === 'partner');
          setPartners(partnerList);
        }
      } catch {}
      setLoading(false);
    }
    loadTeam();
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-24 selection:bg-mimi-primary/30">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-yellow-500/10 to-orange-500/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-[600px] w-[600px] translate-x-1/2 translate-y-1/2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-[150px]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-20 max-w-3xl space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/40 bg-yellow-500/10 px-4 py-1.5 text-xs font-bold text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
            <Handshake className="h-4 w-4" />
            <span>Mạng Lưới Đối Tác Chiến Lược</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Đối Tác Của <span className="text-gradient-mimi">MIMI</span>
          </h1>
          <p className="text-lg text-gray-400">
            Những cá nhân và máy chủ đã đồng hành cùng MIMI xây dựng hệ sinh thái âm nhạc đa nền tảng tuyệt vời trên Discord.
          </p>
        </Reveal>

        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-yellow-500" />
          </div>
        ) : partners.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center space-y-4 rounded-3xl border border-white/5 bg-white/[0.02]">
            <p className="text-gray-400">Chưa có đối tác nào được hiển thị.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((partner, idx) => (
              <Reveal key={partner.id} delay={idx * 100}>
                <div className="glass-panel card-lift group relative flex flex-col items-center overflow-hidden rounded-[2rem] p-6 sm:p-8 text-center transition-all duration-500 hover:border-yellow-500/40 hover:shadow-[0_0_40px_rgba(234,179,8,0.15)]">
                  {/* Glowing background behind avatar */}
                  <div className="absolute left-1/2 top-16 sm:top-20 h-32 w-32 -translate-x-1/2 rounded-full bg-yellow-500/20 blur-[50px] transition-all duration-500 group-hover:bg-yellow-500/40" />
                  
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
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
