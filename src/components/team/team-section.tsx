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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {team.map((member, idx) => {
            const isFounder = member.role.toLowerCase().includes('founder');
            const isDev = member.isDev;
            const isPurple = member.color?.toLowerCase() === '#9b59b6' || (!isDev && !isFounder);
            
            let borderHoverClass = 'hover:border-mimi-purple/60';
            let shadowGlowStyle = '0 0 25px rgba(139,92,246,0.3)';
            let RoleIcon = UserCheck;
            let badgeText = 'Role Discord';
            let badgeColorClass = 'text-mimi-green';
            let avatarRingClass = 'ring-white/10';

            if (isFounder) {
              borderHoverClass = 'hover:border-[#ff6b81]';
              shadowGlowStyle = '0 0 45px rgba(255,107,129,0.5)'; // Glow mạnh nhất cho Founder
              RoleIcon = Crown;
              badgeText = 'Founder';
              badgeColorClass = 'text-[#ff6b81]';
              avatarRingClass = 'ring-[#ff6b81]/40';
            } else if (isDev) {
              borderHoverClass = 'hover:border-[#00f2fe]';
              shadowGlowStyle = '0 0 25px rgba(0,242,254,0.35)'; // Glow ngầu nhưng yếu hơn Founder
              RoleIcon = Code2;
              badgeText = 'System Dev';
              badgeColorClass = 'text-[#00f2fe]';
              avatarRingClass = 'ring-[#00f2fe]/30';
            } else if (!isPurple) {
              borderHoverClass = 'hover:border-mimi-green/60';
              shadowGlowStyle = '0 0 25px rgba(46,204,113,0.3)';
            }

            return (
              <Reveal key={member.id} delay={idx * 100}>
                <div
                  className={`glass-panel card-lift group flex h-full items-center gap-5 rounded-3xl p-7 transition-all duration-500 ${borderHoverClass}`}
                >
                  <div
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-transform duration-500 group-hover:scale-105"
                    style={{
                      borderColor: member.color || (isPurple ? '#8b5cf6' : '#2ecc71'),
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
                    {/* Chấm trạng thái Discord */}
                    <span
                      className={`absolute bottom-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full ring-2 ring-black ${
                        STATUS_COLORS[member.status || 'online'] || 'bg-mimi-green'
                      }`}
                      title={STATUS_TITLES[member.status || 'online'] || 'Discord Member'}
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white">{member.name}</h3>
                      <span className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-bold text-gray-400 border border-white/10">
                        <RoleIcon className={`h-2.5 w-2.5 ${badgeColorClass}`} />
                        <span className={isFounder ? 'text-[#ff6b81]' : (isDev ? 'text-[#00f2fe]' : '')}>{badgeText}</span>
                      </span>
                    </div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: member.color || (isPurple ? '#a78bfa' : '#2ecc71') }}
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
      </div>
    </section>
  );
}
