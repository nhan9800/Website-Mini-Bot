'use client';

import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  /** Độ nghiêng tối đa (độ). */
  maxTilt?: number;
  /** Bật quầng sáng theo con trỏ chuột. */
  spotlight?: boolean;
}

/** Cập nhật hiệu ứng bằng MotionValue, không render lại nội dung ở mỗi lần rê chuột. */
export function TiltCard({ children, className = '', maxTilt = 7, spotlight = true }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Branded tilt/spotlight is intentional site motion and must not be disabled
  // by an inherited OS media query on the live desktop experience.
  const allowMotion = true;
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const scale = useMotionValue(1);
  const spotX = useMotionValue(0);
  const spotY = useMotionValue(0);
  const spotOpacity = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 220, damping: 28 });
  const springY = useSpring(rotateY, { stiffness: 220, damping: 28 });
  const springScale = useSpring(scale, { stiffness: 220, damping: 28 });
  const spotBackground = useMotionTemplate`radial-gradient(420px circle at ${spotX}px ${spotY}px, rgba(98, 166, 143, 0.14), transparent 75%)`;

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
    spotOpacity.set(0);
  };

  const handleMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!allowMotion || event.pointerType !== 'mouse' || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    rotateX.set(-(y / rect.height - 0.5) * maxTilt);
    rotateY.set((x / rect.width - 0.5) * maxTilt);
    scale.set(1.012);
    spotX.set(x);
    spotY.set(y);
    spotOpacity.set(1);
  };

  return (
    <motion.div ref={ref} onPointerMove={handleMove} onPointerLeave={reset} onPointerCancel={reset}
      className={`relative overflow-visible ${className}`}
      style={{ transformPerspective: 1000, rotateX: allowMotion ? springX : 0, rotateY: allowMotion ? springY : 0, scale: allowMotion ? springScale : 1 }}>
      {spotlight && (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]">
          <motion.div className="absolute -inset-px" style={{ opacity: allowMotion ? spotOpacity : 0, background: spotBackground }} />
        </div>
      )}
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}
