'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Disc3, Headphones, Bot, Pause, Play, Hand, Music2 } from 'lucide-react';
import type { ExperienceModel, RobotMotion } from '@/lib/experience';

const Scene = dynamic(() => import('./music-scene'), { ssr: false });

const models = [
  { id: 'robot' as const, label: 'Mimi robot', icon: Bot },
  { id: 'vinyl' as const, label: 'Đĩa nhạc', icon: Disc3 },
  { id: 'headphones' as const, label: 'Tai nghe', icon: Headphones },
];

/** Một canvas cho cả bộ sưu tập. Chuyển động chỉ chạy khi người dùng nhìn thấy. */
export function ExperienceStage() {
  const stage = useRef<HTMLDivElement>(null);
  const [model, setModel] = useState<ExperienceModel>('robot');
  const [motion, setMotion] = useState<RobotMotion>('Dance');
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [started, setStarted] = useState(false);
  const handleReady = useCallback(() => setReady(true), []);
  const handleUnavailable = useCallback(() => setUnavailable(true), []);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => setPlaying(!preference.matches);
    const syncPage = () => setPageVisible(document.visibilityState === 'visible');
    syncMotion(); syncPage();
    // Điện thoại tải poster trước; mô hình được tải khi người xem chọn khám phá.
    setStarted(window.matchMedia('(min-width: 768px)').matches);
    preference.addEventListener('change', syncMotion);
    document.addEventListener('visibilitychange', syncPage);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry?.isIntersecting === true), { rootMargin: '80px' });
    if (stage.current) observer.observe(stage.current);
    return () => {
      preference.removeEventListener('change', syncMotion);
      document.removeEventListener('visibilitychange', syncPage);
      observer.disconnect();
    };
  }, []);

  const animated = playing && visible && pageVisible;

  return (
    <div ref={stage} className="experience-stage" aria-label="Phòng trưng bày 3D Mimi">
      <div className="experience-models" role="group" aria-label="Chọn mô hình 3D">
        {models.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" aria-pressed={model === id} onClick={() => { setStarted(true); if (id !== model) { setReady(false); setModel(id); } }} disabled={unavailable}>
            <Icon size={16} aria-hidden /><span>{label}</span>
          </button>
        ))}
      </div>
      <div className="experience-viewport">
        <div className="experience-orbit" aria-hidden />
        <div className="experience-poster" hidden={ready && !unavailable} aria-hidden="true">
          <picture>
            <source media="(max-width: 767px)" srcSet="/images/mimi-studio-mobile.webp" />
            <Image src="/images/mimi-studio.webp" alt="" width={880} height={880} loading="eager" fetchPriority="high" />
          </picture>
        </div>
        <div className="experience-canvas" aria-hidden="true">
          {started && <Scene model={model} motion={motion} playing={animated} onReady={handleReady} onUnavailable={handleUnavailable} />}
        </div>
      </div>
      <div className="experience-controls">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => { setStarted(true); setPlaying(started ? !playing : true); }} aria-label={!started ? 'Khám phá 3D' : playing ? 'Tạm dừng chuyển động 3D' : 'Bật chuyển động 3D'} disabled={unavailable} aria-pressed={started && playing}>
            {started && playing ? <Pause size={16} /> : <Play size={16} />}<span>{!started ? 'Khám phá 3D' : playing ? 'Tạm dừng' : 'Chuyển động'}</span>
          </button>
          {model === 'robot' && <button type="button" disabled={unavailable} onClick={() => { setStarted(true); setMotion(motion === 'Dance' ? 'Wave' : 'Dance'); setPlaying(true); }} aria-label={motion === 'Dance' ? 'Chào Mimi, cho robot vẫy tay' : 'Nhảy nhạc, cho robot nhảy'}>
            {motion === 'Dance' ? <Hand size={16} /> : <Music2 size={16} />}<span>{motion === 'Dance' ? 'Chào Mimi' : 'Nhảy nhạc'}</span>
          </button>}
        </div>
        <span className="experience-caption" role="status">{unavailable ? 'Ảnh minh họa • thiết bị không hỗ trợ 3D' : !started ? 'Chọn mô hình để bắt đầu' : ready ? 'Kéo để xoay mô hình' : 'Đang chuẩn bị mô hình…'}</span>
      </div>
    </div>
  );
}
