'use client';

import React, { useEffect, useState } from 'react';
import { Reveal } from '@/components/ui/reveal';
import { ShieldCheck, UserCheck, Crown, Code2 } from 'lucide-react';
import type { TeamMember } from '@/app/api/team/route';

const STATUS_COLORS: Record<string, string> = {
  online: 'bg-mimi-green',
  idle: 'bg-yellow-400',
  dnd: 'bg-red-500',
  offline: 'bg-gray-500',
};

const STATUS_TITLES: Record<string, string> = {
  online: 'Trực tuyến trên Discord',
  idle: 'Đang vắng mặt',
  dnd: 'Đang bận (Do Not Disturb)',
  offline: 'Ngoại tuyến',
};

export function TeamSection() {
  const [team, setTeam] = useState<TeamMember[]>([
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
  ]);
  const [source, setSource] = useState<string>('loading');

  useEffect(() => {
    async function loadTeam() {
      try {
        const res = await fetch('/api/team', { cache: 'no-store' });
        const data = await res.json();
        if (data?.ok && data.team && data.team.length > 0) {
          setTeam(data.team);
          setSource(data.source || 'discord_roles');
        }
      } catch {}
    }
    loadTeam();
  }, []);

  return (
    <section id="doi-ngu" className="scroll-mt-24 border-y border-white/5 bg-white/[0.02] py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mx-auto mb-14 max-w-3xl space-y-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-mimi-green/40 bg-mimi-green/10 px-3.5 py-1 text-xs font-bold text-mimi-green shadow-[0_0_15px_rgba(46,204,113,0.25)]">
            <ShieldCheck className="h-4 w-4" />
            <span>Nhận diện tự động qua Role Discord</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Đội Ngũ Đứng Sau <span className="text-gradient-mimi">MIMI</span>
          </h2>
          <p className="text-gray-400">
            Danh sách thành viên được tự động đồng bộ từ Role trong server Discord chính thức của MIMI.
          </p>
        </Reveal>

        {/* --- CORE TEAM --- */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {team.filter(m => m.group === 'core').map((member, idx) => {
            const isFounder = member.role.toLowerCase().includes('founder');
            let borderHoverClass = 'hover-3d-tilt';
            let shadowGlowStyle = '0 0 25px rgba(139,92,246,0.3)';
            let RoleIcon = UserCheck;
            let badgeText = 'Role Discord';
            let badgeColorClass = 'text-mimi-green';
            let avatarRingClass = 'ring-white/10';
            let vipClass = 'glass-panel card-lift hover:border-[#00f2fe]';
            let badgeBgClass = 'bg-white/5 border-white/10';

            if (isFounder) {
              vipClass = 'vip-card-rgb';
              shadowGlowStyle = '0 0 45px rgba(255,107,129,0.5)';
              RoleIcon = Crown;
              badgeText = 'Founder';
              badgeColorClass = 'text-[#ff6b81]';
              badgeBgClass = 'bg-[#ff6b81]/10 border-[#ff6b81]/30 shadow-[0_0_15px_rgba(255,107,129,0.3)]';
              avatarRingClass = 'ring-[#ff6b81]/40';
            } else {
              vipClass = 'vip-card-cyber';
              shadowGlowStyle = '0 0 35px rgba(0,242,254,0.4)';
              RoleIcon = Code2;
              badgeText = 'System Dev';
              badgeColorClass = 'text-[#00f2fe]';
              badgeBgClass = 'bg-[#00f2fe]/10 border-[#00f2fe]/30 shadow-[0_0_15px_rgba(0,242,254,0.3)]';
              avatarRingClass = 'ring-[#00f2fe]/30';
            }

            return (
              <Reveal key={member.id} delay={idx * 100}>
                <div
                  className={`${vipClass} ${borderHoverClass} group flex h-full flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6 rounded-[2rem] p-6 sm:p-8 transition-all duration-500`}
                >
                  {isFounder ? <div className="vip-card-rgb-glow rounded-[2rem]" /> : <div className="vip-card-cyber-glow rounded-[2rem]" />}
                  <div
                    className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-2 transition-transform duration-500 group-hover:scale-105"
                    style={{
                      borderColor: member.color || (isFounder ? '#ff6b81' : '#00f2fe'),
                      boxShadow: shadowGlowStyle,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={member.avatar || '/logo.webp'}
                      alt={member.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/logo.webp';
                      }}
                    />
                    <div className={`absolute inset-0 rounded-2xl ring-1 ring-inset ${avatarRingClass}`} />
                    <span
                      className={`absolute bottom-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full ring-2 ring-black ${
                        STATUS_COLORS[member.status || 'online'] || 'bg-mimi-green'
                      }`}
                      title={STATUS_TITLES[member.status || 'online'] || 'Discord Member'}
                    />
                  </div>

                  <div className="space-y-3 sm:space-y-2">
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <h3 className="text-xl font-extrabold text-white tracking-wide">{member.name}</h3>
                      <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider border ${badgeBgClass}`}>
                        <RoleIcon className={`h-3.5 w-3.5 ${badgeColorClass}`} />
                        <span className={badgeColorClass}>{badgeText}</span>
                      </span>
                    </div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: member.color || (isFounder ? '#ff6b81' : '#00f2fe') }}
                    >
                      {member.role}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-gray-400">
                      {member.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* --- ADMIN & SUPPORT TEAM --- */}
        {team.filter(m => m.group === 'admin' || m.group === 'community').length > 0 && (
          <div className="mt-20">
            <Reveal className="mx-auto mb-10 max-w-2xl space-y-3 text-center">
              <h3 className="text-2xl font-bold text-white">Đội Ngũ Quản Trị & Hỗ Trợ</h3>
              <p className="text-sm text-gray-400">Những người hùng thầm lặng điều phối sự kiện và hỗ trợ giải đáp thắc mắc của cộng đồng MIMI.</p>
            </Reveal>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {team
                .filter(m => m.group === 'admin' || m.group === 'community')
                .sort((a, b) => {
                  const getWeight = (r: string) => {
                    const lower = (r || '').toLowerCase();
                    if (lower.includes('owner')) return 1;
                    if (lower.includes('manager')) return 2;
                    if (lower.includes('event')) return 3;
                    if (lower.includes('staff')) return 4;
                    return 5;
                  };
                  const weightA = getWeight(a.role);
                  const weightB = getWeight(b.role);
                  if (weightA !== weightB) return weightA - weightB;
                  return (a.role || '').localeCompare(b.role || '');
                })
                .map((member, idx) => (
                <Reveal key={member.id} delay={idx * 50}>
                  <div
                    className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.04]"
                    style={{
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = member.color ? `${member.color}66` : 'rgba(255,255,255,0.2)';
                      e.currentTarget.style.boxShadow = `0 10px 30px -10px ${member.color || 'rgba(255,255,255,0.3)'}`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
                    }}
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/10 bg-black/20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={member.avatar || '/logo.webp'}
                        alt={member.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/logo.webp';
                        }}
                      />
                      <span
                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-black ${
                          STATUS_COLORS[member.status || 'online'] || 'bg-mimi-green'
                        }`}
                        title={STATUS_TITLES[member.status || 'online'] || 'Discord Member'}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-bold text-gray-200 transition-colors group-hover:text-white">
                        {member.name}
                      </h4>
                      <p className="truncate text-xs font-semibold tracking-wide" style={{ color: member.color || '#9b59b6' }}>
                        {member.role}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
