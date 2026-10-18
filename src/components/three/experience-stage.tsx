'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Disc3, Headphones, Bot, Hand, Music2 } from 'lucide-react';
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
  // Khởi động ở trạng thái nhìn thấy để canvas desktop không bị đứng nếu trình duyệt
  // trì hoãn callback IntersectionObserver trong lần render đầu. Observer vẫn
  // tạm dừng khi cảnh thật sự ra khỏi viewport để tránh tốn GPU.
  const [visible, setVisible] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const handleReady = useCallback(() => setReady(true), []);
  const handleUnavailable = useCallback(() => setUnavailable(true), []);

  useEffect(() => {
    const syncPage = () => setPageVisible(document.visibilityState === 'visible');
    syncPage();
    document.addEventListener('visibilitychange', syncPage);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry?.isIntersecting !== false), { rootMargin: '80px' });
    if (stage.current) {
      // Đồng bộ một lần ngay lập tức; một số desktop browser chỉ phát
      // intersection callback sau một frame hoặc khi có scroll.
      const rect = stage.current.getBoundingClientRect();
      setVisible(rect.bottom > -80 && rect.top < window.innerHeight + 80);
      observer.observe(stage.current);
    }
    return () => {
      document.removeEventListener('visibilitychange', syncPage);
      observer.disconnect();
    };
  }, []);

  // Theo yêu cầu chủ website: tự chuyển động trên mọi kích thước màn hình,
  // không có công tắc. Chỉ ngừng render khi người xem không nhìn thấy cảnh.
  const animated = visible && pageVisible;

  return (
    <div ref={stage} className="experience-stage" aria-label="Phòng trưng bày 3D Mimi">
      <div className="experience-models" role="group" aria-label="Chọn mô hình 3D">
        {models.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" aria-pressed={model === id} onClick={() => { if (id !== model) { setReady(false); setModel(id); } }} disabled={unavailable}>
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
          <Scene model={model} motion={motion} playing={animated} onReady={handleReady} onUnavailable={handleUnavailable} />
        </div>
      </div>
      <div className="experience-controls">
        <div className="flex items-center gap-2">
          {model === 'robot' && <button type="button" disabled={unavailable} onClick={() => setMotion(motion === 'Dance' ? 'Wave' : 'Dance')} aria-label={motion === 'Dance' ? 'Chào Mimi, cho robot vẫy tay' : 'Nhảy nhạc, cho robot nhảy'}>
            {motion === 'Dance' ? <Hand size={16} /> : <Music2 size={16} />}<span>{motion === 'Dance' ? 'Chào Mimi' : 'Nhảy nhạc'}</span>
          </button>}
        </div>
        <span className="experience-caption" role="status">{unavailable ? 'Ảnh minh họa • thiết bị không hỗ trợ 3D' : !ready ? 'Đang chuẩn bị mô hình…' : `${model === 'robot' ? motion === 'Dance' ? 'Mimi đang nhảy nhạc' : 'Mimi đang vẫy tay' : model === 'vinyl' ? 'Đĩa nhạc đang quay' : 'Tai nghe đang xoay'} • Kéo để xoay`}</span>
      </div>
    </div>
  );
}
