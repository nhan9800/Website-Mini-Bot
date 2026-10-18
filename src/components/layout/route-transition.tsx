'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

/**
 * Một lớp chuyển cảnh nhẹ cho toàn bộ route. Chỉ animate opacity/transform,
 * không giữ state của trang cũ và tự tắt khi người dùng yêu cầu giảm chuyển động.
 */
export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
        className="min-h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
