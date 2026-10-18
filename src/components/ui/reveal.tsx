'use client';

import React, { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Trễ hiệu ứng (ms) để dàn hàng các phần tử. */
  delay?: number;
}

/**
 * Bọc phần tử để hiện dần + trượt lên khi cuộn tới bằng Framer Motion.
 * Viewport observer chỉ giữ hiệu ứng một lần, tránh chạy lại khi cuộn ngược.
 */
export function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: reducedMotion ? 0 : 0.68,
        delay: reducedMotion ? 0 : delay / 1000,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
