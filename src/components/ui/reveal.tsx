'use client';

import React from 'react';
import { motion } from 'framer-motion';

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
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.68,
        delay: delay / 1000,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
