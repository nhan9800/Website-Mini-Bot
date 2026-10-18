'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowRight, Check, Coins, KeyRound, LayoutDashboard, MessageCircle, Music, Shield, Trophy } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import './services-story.css';

const STICKY_TOP = 104;
const PIN_QUERY = '(min-width: 1024px) and (min-height: 650px)';

const services: Array<{ key: string; icon: LucideIcon; label: string; title: string; desc: string; bullets: string[] }> = [
  {
    key: 'music', icon: Music, label: 'Cùng nghe', title: 'Một phòng nhạc cho cả nhóm',
    desc: 'Tìm bài, quản lý hàng chờ, lặp bài và bật autoplay. Bảng điều khiển nằm ngay trong Discord, dễ dùng cả trên điện thoại.',
    bullets: ['Không cần API key', 'Ở lại kênh 24/7', 'Lyrics + TTS tiếng Việt'],
  },
  {
    key: 'roles', icon: Shield, label: 'Cùng quản lý', title: 'Thành viên và vai trò',
    desc: 'Quản trị viên cấu hình kênh và vai trò xác thực; thành viên bấm nút để nhận vai trò. Có tùy chọn gỡ xác thực khi bot xử lý mute.',
    bullets: ['Xác thực bằng nút bấm', 'Cấu hình vai trò', 'Đặt lại theo yêu cầu quản trị'],
  },
  {
    key: 'community', icon: Coins, label: 'Cùng hoạt động', title: 'Sinh hoạt cộng đồng',
    desc: 'Chấm công, báo cáo tuần, cấp độ và minigame xu giúp quản trị viên theo dõi hoạt động của cộng đồng.',
    bullets: ['Báo cáo tự động', 'Cảnh báo gian lận', 'Quản lý minh bạch'],
  },
  {
    key: 'dashboard', icon: LayoutDashboard, label: 'Cùng điều khiển', title: 'Điều khiển từ trình duyệt',
    desc: 'Mở dashboard bằng khóa truy cập được cấp trong Discord để xem nhạc, hàng chờ và cấu hình máy chủ.',
    bullets: ['Khóa truy cập theo server', 'Dữ liệu từ bot', 'Không cần cài đặt'],
  },
];

/** Decorative diagrams explain the feature without inventing live server metrics. */
function ServiceIllustration({ kind }: { kind: string }) {
  if (kind === 'music') return (
    <div className="services-illustration services-soundscape" aria-hidden="true">
      <div className="services-record"><Music size={25} /></div>
      <div className="services-waveform">{[24, 45, 67, 38, 82, 55, 95, 68, 42, 76, 54, 31, 64, 43, 86, 58, 35, 70].map((height, index) => <span key={index} style={{ height: `${height}%` }} />)}</div>
      <span className="services-art-caption">Âm nhạc · Cùng nghe</span>
    </div>
  );
  if (kind === 'roles') return (
    <div className="services-illustration services-permissions" aria-hidden="true">
      <div className="services-role-seal"><Shield size={34} /><span><Check size={13} /></span></div>
      <div className="services-role-steps">{['Xác thực', 'Vai trò', 'Quyền truy cập'].map((label, index) => <span key={label}><i>{String(index + 1).padStart(2, '0')}</i>{label}</span>)}</div>
      <span className="services-art-caption">Thiết lập theo máy chủ</span>
    </div>
  );
  if (kind === 'community') return (
    <div className="services-illustration services-community" aria-hidden="true">
      <div className="services-community-orbit"><MessageCircle size={23} /><Trophy size={31} /><Coins size={23} /></div>
      <div className="services-community-tags"><span>Hoạt động</span><span>Cấp độ</span><span>Minigame</span></div>
      <span className="services-art-caption">Cộng đồng · Mỗi ngày</span>
    </div>
  );
  return (
    <div className="services-illustration services-dashboard" aria-hidden="true">
      <div className="services-terminal"><div><i /><i /><i /><span>Mimi dashboard</span></div><code><span>↳</span> /dashboard</code><p><KeyRound size={13} /> Khóa truy cập máy chủ</p></div>
      <span className="services-art-caption">Trình duyệt <ArrowRight size={12} /> Mimi Bot</span>
    </div>
  );
}

function ServiceCard({ service, index, pinned, onFocus }: { service: typeof services[number]; index: number; pinned: boolean; onFocus: () => void }) {
  const card = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: card, offset: ['start end', 'end start'] });
  // A small reversible drift follows native touch scrolling; content stays fully opaque.
  const y = useTransform(scrollYProgress, [0, 0.45, 1], [18, 0, -12]);
  const rotate = useTransform(scrollYProgress, [0, 0.45, 1], [index % 2 ? 0.7 : -0.7, 0, index % 2 ? -0.3 : 0.3]);
  const Icon = service.icon;
  return (
    <motion.article ref={card} className={`services-story-card services-card-${service.key}`} data-service-index={index}
      tabIndex={0} aria-labelledby={`service-title-${service.key}`} onFocus={onFocus}
      style={pinned ? { y: 0, rotate: 0 } : { y, rotate }}>
      <div className="services-card-copy">
        <div className="services-card-meta"><span><Icon size={16} aria-hidden="true" />{service.label}</span><span>{String(index + 1).padStart(2, '0')}</span></div>
        <h3 id={`service-title-${service.key}`}>{service.title}</h3>
        <p>{service.desc}</p>
        <ul>{service.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>
      </div>
      <ServiceIllustration kind={service.key} />
    </motion.article>
  );
}

/** Native document scrolling controls a sticky horizontal story on roomy desktops. */
export function ServicesStory() {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [eligible, setEligible] = useState(false);
  const [geometry, setGeometry] = useState({ travel: 0, stageHeight: 500 });
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: root, offset: [`start ${STICKY_TOP}px`, `end ${STICKY_TOP + geometry.stageHeight}px`] });
  // One pixel of downward scroll moves the rail one pixel to the left.
  const x = useTransform(scrollYProgress, [0, 1], [0, -geometry.travel]);
  const pinned = eligible && geometry.travel > 0;

  useEffect(() => {
    const media = window.matchMedia(PIN_QUERY);
    const sync = () => setEligible(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (!stage.current || !viewport.current || !track.current) return;
        const railStyle = getComputedStyle(viewport.current);
        const width = viewport.current.clientWidth - parseFloat(railStyle.paddingLeft) - parseFloat(railStyle.paddingRight);
        const travel = eligible ? Math.max(0, track.current.scrollWidth - width) : 0;
        const stageHeight = Math.ceil(stage.current.getBoundingClientRect().height);
        setGeometry(previous => previous.travel === travel && previous.stageHeight === stageHeight ? previous : { travel, stageHeight });
      });
    };
    const observer = new ResizeObserver(measure);
    [stage.current, viewport.current, track.current].forEach(element => { if (element) observer.observe(element); });
    measure();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); };
  }, [eligible]);

  useMotionValueEvent(scrollYProgress, 'change', progress => {
    if (pinned) setActive(Math.max(0, Math.min(services.length - 1, Math.round(progress * (services.length - 1)))));
  });

  const showCard = useCallback((index: number) => {
    if (!pinned || !root.current || !viewport.current || !track.current) return;
    const card = track.current.children[index] as HTMLElement | undefined;
    if (!card) return;
    const distance = Math.max(0, Math.min(geometry.travel, card.offsetLeft - (viewport.current.clientWidth - card.offsetWidth) / 2));
    const top = window.scrollY + root.current.getBoundingClientRect().top - STICKY_TOP + distance;
    // Let the homepage scroll controller synchronize its target first. If it is
    // absent, native scrolling still brings a keyboard-focused card into view.
    const request = new CustomEvent('mimi:scroll-to', { detail: { top }, cancelable: true });
    if (window.dispatchEvent(request)) window.scrollTo({ top, behavior: 'instant' as ScrollBehavior });
  }, [geometry.travel, pinned]);

  return (
    <div ref={root} className={`services-story${eligible ? ' is-pinned' : ''}`} data-motion-pattern="horizontal-scroll-story"
      style={pinned ? { height: geometry.stageHeight + geometry.travel } : undefined}>
      <div ref={stage} className="services-story-stage">
        <div className="services-story-heading">
          <div><p className="services-eyebrow">Một Mimi · Bốn cách kết nối</p><h2>Mimi trong <span>máy chủ của bạn</span></h2></div>
          <p>Từ một buổi nghe nhạc đến hoạt động thường ngày, mọi tính năng cộng đồng đều miễn phí.</p>
        </div>
        <div ref={viewport} className="services-story-viewport">
          <motion.div ref={track} className="services-story-track" style={{ x: eligible ? x : 0 }}>
            {services.map((service, index) => <ServiceCard key={service.key} service={service} index={index} pinned={eligible} onFocus={() => showCard(index)} />)}
          </motion.div>
        </div>
        <div className="services-story-footer">
          <span className="services-scroll-hint"><ArrowDown size={14} aria-hidden="true" /><span>{eligible ? 'Cuộn để khám phá' : 'Khám phá từng tính năng'}</span></span>
          {eligible && <nav className="services-chapters" aria-label="Chuyển đến tính năng">{services.map((service, index) => <button key={service.key} type="button" aria-label={`Xem ${service.title}`} aria-current={active === index ? 'step' : undefined} onClick={() => showCard(index)}><span>{String(index + 1).padStart(2, '0')}</span></button>)}</nav>}
          <div className="services-story-progress" aria-hidden="true"><motion.span style={{ scaleX: eligible ? scrollYProgress : 1 }} /></div>
        </div>
      </div>
    </div>
  );
}
