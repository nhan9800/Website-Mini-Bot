'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/** A reading rail links the About story to the reader's actual scroll position. */
export function ScrollNarrative({ children, className = '' }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: root, offset: ['start 0.8', 'end 0.35'] });
  const y = useTransform(scrollYProgress, [0, 1], [14, -14]);
  return (
    <div ref={root} className="scroll-narrative" data-motion-scene="reading-rail">
      <span className="narrative-rail" aria-hidden="true"><motion.span style={{ scaleY: scrollYProgress }} /></span>
      <motion.div className={className} style={{ y }}>{children}</motion.div>
    </div>
  );
}
