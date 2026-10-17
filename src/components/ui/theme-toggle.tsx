'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

/** Chỉ lưu lựa chọn giao diện trên trình duyệt, không ghi dữ liệu tài khoản. */
export function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    let preference: string | null = null;
    try { preference = localStorage.getItem('mimi-theme'); } catch { /* Chế độ riêng tư có thể chặn storage. */ }
    const useLight = preference ? preference === 'light' : !window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.dataset.theme = useLight ? 'light' : 'dark';
    setLight(useLight);
  }, []);

  const toggle = () => {
    const useLight = !light;
    document.documentElement.dataset.theme = useLight ? 'light' : 'dark';
    setLight(useLight);
    try { localStorage.setItem('mimi-theme', useLight ? 'light' : 'dark'); } catch { /* Vẫn đổi được giao diện khi storage bị chặn. */ }
  };

  return (
    <button type="button" onClick={toggle} aria-label={light ? 'Chuyển sang giao diện tối' : 'Chuyển sang giao diện sáng'}
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 text-white/70 transition-colors hover:bg-white/5 hover:text-white">
      {light ? <Moon className="h-4 w-4" aria-hidden="true" /> : <Sun className="h-4 w-4" aria-hidden="true" />}
    </button>
  );
}
