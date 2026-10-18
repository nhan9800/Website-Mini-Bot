'use client';

import React, { useEffect, useMemo, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type HTMLMotionProps,
  type Variants,
} from 'framer-motion';

type RevealVariant = 'mask' | 'lift' | 'clip' | 'flip' | 'drift' | 'scale';

const variants: Record<RevealVariant, Variants> = {
  mask: {
    hidden: { clipPath: 'inset(0 0 100% 0)', y: 18 },
    visible: { clipPath: 'inset(0 0 0% 0)', y: 0 },
  },
  lift: {
    hidden: { opacity: 0, y: 34 },
    visible: { opacity: 1, y: 0 },
  },
  clip: {
    hidden: { opacity: 0, clipPath: 'inset(0 16% 0 16%)', scale: 0.96 },
    visible: { opacity: 1, clipPath: 'inset(0 0% 0 0%)', scale: 1 },
  },
  flip: {
    hidden: { opacity: 0, rotateX: -14, y: 20, transformPerspective: 900 },
    visible: { opacity: 1, rotateX: 0, y: 0, transformPerspective: 900 },
  },
  drift: {
    hidden: { opacity: 0, x: 36, rotate: 1.5 },
    visible: { opacity: 1, x: 0, rotate: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.88 },
    visible: { opacity: 1, scale: 1 },
  },
};

interface MotionRevealProps extends HTMLMotionProps<'div'> {
  variant?: RevealVariant;
  delay?: number;
  amount?: number;
}

/**
 * A small, composable viewport primitive. Every section can choose a different
 * choreography while sharing the same cleanup and reduced-motion behaviour.
 */
export function MotionReveal({
  children,
  className,
  variant = 'lift',
  delay = 0,
  amount = 0.18,
  ...props
}: MotionRevealProps) {
  // Section choreography is part of Mimi's branded navigation language. Keep
  // it alive on desktop/mobile even when the browser has a reduced-motion
  // preference; only continuous ambient effects and pointer physics opt out.
  // This prevents the PC configuration that previously made every route look
  // frozen while leaving the interactive primitives below accessible.
  const transition = { duration: variant === 'mask' ? 0.82 : 0.62, delay, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <motion.div
      className={className}
      variants={variants[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      transition={transition}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface SplitLineProps extends HTMLMotionProps<'span'> {
  children: React.ReactNode;
  delay?: number;
}

/** Text masking for short hero lines; preserves a real text node for screen readers. */
export function SplitLine({ children, delay = 0, className, ...props }: SplitLineProps) {
  return (
    <motion.span
      className={`motion-split-line inline-block overflow-hidden align-bottom ${className ?? ''}`}
      initial={{ clipPath: 'inset(0 0 100% 0)', y: '0.55em' }}
      animate={{ clipPath: 'inset(0 0 0% 0%)', y: 0 }}
      transition={{ duration: 0.76, delay, ease: [0.19, 1, 0.22, 1] }}
      {...props}
    >
      <span className="inline-block">{children}</span>
    </motion.span>
  );
}

interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

/** Pointer-following wrapper for primary CTAs. The spring settles without layout work. */
export function Magnetic({ children, className, strength = 0.16 }: MagneticProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 420, damping: 28, mass: 0.45 });
  const y = useSpring(pointerY, { stiffness: 420, damping: 28, mass: 0.45 });

  useEffect(() => {
    if (reduced) {
      pointerX.set(0);
      pointerY.set(0);
    }
  }, [pointerX, pointerY, reduced]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={reduced ? undefined : { x, y }}
      onPointerMove={(event) => {
        if (reduced || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        pointerX.set((event.clientX - (rect.left + rect.width / 2)) * strength);
        pointerY.set((event.clientY - (rect.top + rect.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        pointerX.set(0);
        pointerY.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

interface OdometerProps {
  value: string;
  className?: string;
}

/** Keyed spring swap creates a compact odometer-like change for live stats. */
export function Odometer({ value, className }: OdometerProps) {
  const reduced = useReducedMotion();
  const key = useMemo(() => value, [value]);
  return (
    <span className={className} aria-live="polite">
      <motion.span
        key={key}
        initial={reduced ? false : { y: 16, opacity: 0, filter: 'blur(4px)' }}
        animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
        transition={reduced ? { duration: 0.01 } : { type: 'spring', stiffness: 280, damping: 24 }}
        className="inline-block"
      >
        {value}
      </motion.span>
    </span>
  );
}
