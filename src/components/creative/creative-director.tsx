'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import type Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import './creative.css';

/** Home-only scroll/pointer direction. Each route exit destroys the active instance. */
export function CreativeDirector() {
  const pathname = usePathname();
  const [cursorEnabled, setCursorEnabled] = useState(false);
  const pointerX = useMotionValue(-100);
  const pointerY = useMotionValue(-100);
  const opacity = useMotionValue(0);
  const size = useMotionValue(1);
  // A light ring follows with spring inertia; the native pointer remains available.
  const x = useSpring(pointerX, { stiffness: 360, damping: 31, mass: 0.4 });
  const y = useSpring(pointerY, { stiffness: 360, damping: 31, mass: 0.4 });
  const scale = useSpring(size, { stiffness: 400, damping: 27, mass: 0.45 });

  useEffect(() => {
    if (pathname !== '/') return;
    const media = matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    let disposed = false;
    let instance: Lenis | undefined;
    let frame = 0;
    let lockObserver: MutationObserver | undefined;

    const stopFrame = () => cancelAnimationFrame(frame);
    const tick = (time: number) => {
      if (!instance || document.hidden) return;
      instance.raf(time);
      frame = requestAnimationFrame(tick);
    };
    const syncVisibility = () => {
      stopFrame();
      if (!instance) return;
      if (document.hidden || document.body.style.overflow === 'hidden') instance.stop();
      else { instance.start(); frame = requestAnimationFrame(tick); }
    };
    const teardown = () => {
      stopFrame();
      lockObserver?.disconnect();
      instance?.destroy();
      instance = undefined;
    };
    const setup = async () => {
      teardown();
      if (!media.matches) return;
      const { default: LenisRuntime } = await import('lenis');
      if (disposed || !media.matches || instance) return;
      instance = new LenisRuntime({
        autoRaf: false,
        lerp: 0.14,
        smoothWheel: true,
        syncTouch: false,
        anchors: { offset: -96 },
        // Chart lists, forms, dialogs and the 3D canvas retain native input.
        prevent: node => {
          const native = Boolean(node.closest('[data-lenis-prevent], [role="dialog"], dialog, input, textarea, select, .trending-scroll-list, .services-story-card, .experience-stage'));
          // Lenis returns early for native regions before stopping its current
          // interpolation. Cancel that earlier wheel target so a new native
          // scroll cannot fight the still-running smooth animation.
          if (native && instance?.isScrolling === 'smooth' && document.body.style.overflow !== 'hidden') {
            instance.scrollTo(window.scrollY, { immediate: true });
          }
          return native;
        },
      });
      lockObserver = new MutationObserver(syncVisibility);
      lockObserver.observe(document.body, { attributes: true, attributeFilter: ['style'] });
      syncVisibility();
    };
    // A failed optional chunk leaves normal browser scrolling available.
    const onMediaChange = () => { void setup().catch(teardown); };
    const onScrollRequest = (event: Event) => {
      if (!instance || document.body.style.overflow === 'hidden' || !(event instanceof CustomEvent)) return;
      const top = event.detail?.top;
      if (typeof top !== 'number' || !Number.isFinite(top)) return;
      event.preventDefault();
      // Chapter navigation must cancel an earlier wheel target, not fight it.
      instance.scrollTo(top, { immediate: true });
    };
    media.addEventListener('change', onMediaChange);
    document.addEventListener('visibilitychange', syncVisibility);
    window.addEventListener('mimi:scroll-to', onScrollRequest);
    void setup().catch(teardown);
    return () => {
      disposed = true;
      media.removeEventListener('change', onMediaChange);
      document.removeEventListener('visibilitychange', syncVisibility);
      window.removeEventListener('mimi:scroll-to', onScrollRequest);
      teardown();
    };
  }, [pathname]);

  useEffect(() => {
    const media = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const sync = () => setCursorEnabled(pathname === '/' && media.matches);
    sync();
    media.addEventListener('change', sync);
    if (pathname !== '/') { opacity.set(0); return () => media.removeEventListener('change', sync); }
    const move = (event: PointerEvent) => {
      if (!media.matches || event.pointerType !== 'mouse') { opacity.set(0); return; }
      const target = event.target instanceof Element ? event.target : null;
      const excluded = target?.closest('input, textarea, select, [role="dialog"], canvas');
      pointerX.set(event.clientX - 18);
      pointerY.set(event.clientY - 18);
      size.set(target?.closest('a, button, [role="button"]') ? 1.65 : 1);
      opacity.set(excluded ? 0 : 0.75);
    };
    const hide = () => opacity.set(0);
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', hide);
    window.addEventListener('blur', hide);
    return () => {
      media.removeEventListener('change', sync);
      window.removeEventListener('pointermove', move);
      document.documentElement.removeEventListener('pointerleave', hide);
      window.removeEventListener('blur', hide);
      hide();
    };
  }, [pathname, opacity, pointerX, pointerY, size]);

  return cursorEnabled ? <motion.div aria-hidden="true" className="creative-cursor" style={{ x, y, scale, opacity }} /> : null;
}
