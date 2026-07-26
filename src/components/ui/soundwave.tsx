'use client';

import React from 'react';

const BAR_HEIGHTS = [42, 78, 34, 92, 58, 100, 48, 84, 40, 96, 66, 88, 36, 80, 56, 94, 50, 72, 38, 86];

interface SoundwaveProps {
  playing: boolean;
  bars?: number;
  className?: string;
}

/** Thanh equalizer nhún nhảy bằng CSS thuần — mỗi cột lệch pha một chút. */
export function Soundwave({ playing, bars = 20, className = '' }: SoundwaveProps) {
  const heights = BAR_HEIGHTS.slice(0, bars);
  return (
    <div
      className={`flex h-14 items-end justify-between gap-1 rounded-2xl border border-white/5 bg-black/40 px-3 py-2 ${className}`}
      aria-hidden
    >
      {heights.map((h, i) => (
        <span
          key={i}
          className="w-1.5 origin-bottom rounded-full bg-gradient-to-t from-mimi-green to-mimi-cyan"
          style={{
            height: `${h}%`,
            animation: playing ? `soundwave ${0.9 + (i % 5) * 0.12}s ease-in-out ${i * 0.06}s infinite` : 'none',
            transform: playing ? undefined : 'scaleY(0.22)',
            transition: 'transform 0.4s ease',
          }}
        />
      ))}
    </div>
  );
}
