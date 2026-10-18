'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export function FooterWave() {
  const root = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: root, offset: ['start end', 'start 0.6'] });
  const pathLength = useTransform(scrollYProgress, [0, 0.85], [0, 1]);
  // Matching SVG commands allow the curve to morph without a layout measurement.
  const curve = useTransform(scrollYProgress, [0, 1], [
    'M0 18 C180 16 300 20 480 18 S780 16 960 18 S1260 20 1440 18',
    'M0 18 C180 2 300 34 480 18 S780 2 960 18 S1260 34 1440 18',
  ]);
  return <div ref={root} className="footer-wave" aria-hidden="true" data-motion-scene="footer-morph"><svg viewBox="0 0 1440 36" preserveAspectRatio="none"><motion.path d={curve} style={{ pathLength }} /></svg></div>;
}
