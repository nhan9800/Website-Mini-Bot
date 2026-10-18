'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

/**
 * Một lớp chuyển cảnh nhẹ cho toàn bộ route. Dùng clip-path để tránh layout shift,
 * không giữ state của trang cũ và tự tắt khi người dùng yêu cầu giảm chuyển động.
 */
export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ clipPath: 'inset(0 0 100% 0)', opacity: 0.01 }}
        animate={{ clipPath: 'inset(0 0 0% 0)', opacity: 1 }}
        exit={{ clipPath: 'inset(100% 0 0 0)', opacity: 0.01 }}
        transition={{ duration: 0.46, ease: [0.16, 1, 0.3, 1] }}
        className="min-h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
