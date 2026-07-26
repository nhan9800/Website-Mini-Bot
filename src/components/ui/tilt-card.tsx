'use client';

import React, { useRef } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  /** Độ nghiêng tối đa (độ). */
  maxTilt?: number;
}

/**
 * Card nghiêng 3D theo con trỏ chuột (perspective + rotateX/rotateY).
 * Không thư viện — chỉ transform CSS, tự tắt trên thiết bị cảm ứng
 * và khi người dùng bật giảm chuyển động.
 */
export function TiltCard({ children, className = '', maxTilt = 8 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const reset = () => {
    const el = ref.current;
    if (el) el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
  };

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-py * maxTilt).toFixed(2)}deg) rotateY(${(px * maxTilt).toFixed(2)}deg) translateZ(0)`;
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={className}
      style={{ transition: 'transform 0.25s ease-out', willChange: 'transform' }}
    >
      {children}
    </div>
  );
}
