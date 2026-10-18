'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

const dialogStack: string[] = [];
let nextLayer = 120;
let savedOverflow = '';
let savedPadding = '';

interface ModalShellProps {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  describedBy?: string;
  children: ReactNode;
  className?: string;
  animation?: 'scale' | 'lift';
}

/** One portal/focus boundary shared by feedback, payment and their nested notices. */
export function ModalShell({ open, onClose, labelledBy, describedBy, children, className = '', animation = 'scale' }: ModalShellProps) {
  const id = useId();
  const panel = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  const openRef = useRef(open);
  openRef.current = open;
  const [ready, setReady] = useState(false);
  const [boundaryActive, setBoundaryActive] = useState(open);
  const [layer, setLayer] = useState(120);
  const [viewport, setViewport] = useState<{ height: number; top: number } | null>(null);

  useEffect(() => { setReady(true); }, []);
  useEffect(() => { if (open) setBoundaryActive(true); }, [open]);

  useEffect(() => {
    if (!boundaryActive || !ready || !panel.current) return;
    const target = panel.current;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (dialogStack.length === 0) {
      savedOverflow = document.body.style.overflow;
      savedPadding = document.body.style.paddingRight;
      const scrollbar = window.innerWidth - document.documentElement.clientWidth;
      if (scrollbar > 0) document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + scrollbar}px`;
      document.body.style.overflow = 'hidden';
    }
    dialogStack.push(id);
    setLayer(nextLayer++);

    const topmost = () => dialogStack.at(-1) === id;
    const focusable = () => Array.from(target.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )).filter(element => element.tabIndex >= 0 && element.getClientRects().length > 0);
    const focusInside = () => (target.querySelector<HTMLElement>('[data-dialog-autofocus]') || target).focus({ preventScroll: true });
    const keydown = (event: KeyboardEvent) => {
      if (!topmost()) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (openRef.current) close.current();
      } else if (event.key === 'Tab') {
        const controls = focusable();
        const first = controls[0];
        const last = controls.at(-1);
        if (!first) { event.preventDefault(); target.focus(); return; }
        if (event.shiftKey && (document.activeElement === first || document.activeElement === target)) {
          event.preventDefault(); last?.focus();
        } else if (!event.shiftKey && (document.activeElement === last || !target.contains(document.activeElement))) {
          event.preventDefault(); first.focus();
        }
      }
    };
    const focusin = (event: FocusEvent) => {
      if (topmost() && event.target instanceof Node && !target.contains(event.target)) focusInside();
    };
    // VisualViewport follows the keyboard as well as the browser's dynamic bars.
    const updateViewport = () => setViewport(window.visualViewport
      ? { height: window.visualViewport.height, top: window.visualViewport.offsetTop }
      : { height: window.innerHeight, top: 0 });
    updateViewport();
    window.visualViewport?.addEventListener('resize', updateViewport);
    window.visualViewport?.addEventListener('scroll', updateViewport);
    window.addEventListener('resize', updateViewport);
    document.addEventListener('keydown', keydown, true);
    document.addEventListener('focusin', focusin);
    focusInside();

    return () => {
      const wasTopmost = topmost();
      const index = dialogStack.indexOf(id);
      if (index !== -1) dialogStack.splice(index, 1);
      document.removeEventListener('keydown', keydown, true);
      document.removeEventListener('focusin', focusin);
      window.visualViewport?.removeEventListener('resize', updateViewport);
      window.visualViewport?.removeEventListener('scroll', updateViewport);
      window.removeEventListener('resize', updateViewport);
      if (!dialogStack.length) {
        document.body.style.overflow = savedOverflow;
        document.body.style.paddingRight = savedPadding;
      }
      if (wasTopmost && previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [boundaryActive, id, ready]);

  if (!ready) return null;
  return createPortal(
    <AnimatePresence initial={false} onExitComplete={() => {
      // Keep the focus boundary, scrollbar compensation and Lenis pause until
      // the final panel/backdrop frame has left. Unmount still cleans at once.
      if (!openRef.current) setBoundaryActive(false);
    }}>
      {open && (
        <motion.div className="fixed inset-x-0 flex items-center justify-center p-4 sm:p-6"
          style={{ zIndex: layer, top: viewport?.top || 0, height: viewport?.height || '100dvh', paddingTop: 'max(1rem, env(safe-area-inset-top))', paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}>
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" aria-hidden="true" onClick={() => { if (openRef.current && dialogStack.at(-1) === id) close.current(); }} />
          <motion.div ref={panel} role="dialog" aria-modal="true" aria-labelledby={labelledBy} aria-describedby={describedBy} tabIndex={-1}
            className={`mimi-modal-panel relative w-full overflow-y-auto overscroll-contain outline-none ${className}`}
            style={{ maxHeight: '100%' }}
            initial={animation === 'lift' ? { y: 28, opacity: 0 } : { y: 16, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 10, scale: 0.985, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
