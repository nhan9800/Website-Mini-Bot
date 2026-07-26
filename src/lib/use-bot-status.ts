'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { BotStatus } from '@/lib/types';

interface UseBotStatusResult {
  status: BotStatus | null;
  error: string | null;
  loading: boolean;
  lastUpdated: Date | null;
  refresh: () => void;
}

/**
 * Hook lấy trạng thái bot thật từ /api/status (proxy sang Internal API).
 * Tự polling theo chu kỳ; dừng khi tab bị ẩn để tiết kiệm tài nguyên.
 */
export function useBotStatus(intervalMs = 15000): UseBotStatusResult {
  const [status, setStatus] = useState<BotStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/status', { cache: 'no-store' });
      const data = await res.json();
      if (res.ok && data?.ok) {
        setStatus(data as BotStatus);
        setError(null);
      } else {
        setError(data?.error?.message || `Máy chủ trả về mã lỗi ${res.status}.`);
      }
    } catch {
      setError('Không thể kết nối tới máy chủ web.');
    } finally {
      setLoading(false);
      setLastUpdated(new Date());
    }
  }, []);

  useEffect(() => {
    fetchStatus();

    const start = () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(fetchStatus, intervalMs);
    };
    const stop = () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    const onVisibility = () => {
      if (document.hidden) stop();
      else {
        fetchStatus();
        start();
      }
    };

    start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [fetchStatus, intervalMs]);

  return { status, error, loading, lastUpdated, refresh: fetchStatus };
}
