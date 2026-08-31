'use client';

import React, { useRef, useState } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  /** Độ nghiêng tối đa (độ). */
  maxTilt?: number;
  /** Bật quầng sáng spotlight theo chuột */
  spotlight?: boolean;
}

/**
 * Card nghiêng 3D theo con trỏ chuột (perspective + rotateX/rotateY)
 * tích hợp hiệu ứng Spotlight Glow theo vị trí chuột siêu mượt mà.
 */
export function TiltCard({
  children,
  className = '',
  maxTilt = 7,
  spotlight = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ x: number; y: number; opacity: number }>({
    x: 0,
    y: 0,
    opacity: 0,
  });

  const reset = () => {
    const el = ref.current;
    if (el) {
      el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
    setCoords((prev) => ({ ...prev, opacity: 0 }));
  };

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = x / rect.width - 0.5;
    const py = y / rect.height - 0.5;

    el.style.transform = `perspective(1000px) rotateX(${(-py * maxTilt).toFixed(2)}deg) rotateY(${(px * maxTilt).toFixed(2)}deg) scale3d(1.018, 1.018, 1.018)`;
    setCoords({ x, y, opacity: 1 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setCoords((prev) => ({ ...prev, opacity: 1 }))}
      onMouseLeave={reset}
      className={`relative overflow-hidden ${className}`}
      style={{
        transition: 'transform 0.22s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.22s ease',
        willChange: 'transform',
      }}
    >
      {spotlight && (
        <div
          className="pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-300 z-10"
          style={{
            opacity: coords.opacity,
            background: `radial-gradient(420px circle at ${coords.x}px ${coords.y}px, rgba(46, 204, 113, 0.16), rgba(34, 211, 238, 0.08), transparent 75%)`,
          }}
        />
      )}
      {children}
    </div>
  );
}
