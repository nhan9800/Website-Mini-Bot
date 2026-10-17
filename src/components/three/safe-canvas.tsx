'use client';

import React, { useEffect, useState } from 'react';
import { Canvas, type CanvasProps } from '@react-three/fiber';

/** Three.js từ r163 chỉ dựng hình bằng WebGL 2. */
export function supportsWebGL2(): boolean {
  if (typeof document === 'undefined') return false;

  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2');
    if (!context) return false;
    // Trả lại tài nguyên của phép thử, tránh giữ thêm context cho từng thẻ đội ngũ.
    context.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

class WebGLBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** Giữ nguyên nội dung trang khi GPU không khả dụng hoặc bộ dựng hình khởi tạo lỗi. */
export function SafeCanvas({ fallback = null, ...props }: CanvasProps) {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(supportsWebGL2());
  }, []);

  if (!supported) return <>{fallback}</>;

  return (
    <WebGLBoundary fallback={fallback}>
      <Canvas {...props} fallback={fallback} />
    </WebGLBoundary>
  );
}
