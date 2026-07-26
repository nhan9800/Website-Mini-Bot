import React from 'react';

export type Icon3DName =
  | 'music'
  | 'shield'
  | 'clock'
  | 'dashboard'
  | 'headphone'
  | 'money'
  | 'mic'
  | 'robot'
  | 'sparkles'
  | 'rocket'
  | 'star'
  | 'heart';

interface Icon3DProps {
  name: Icon3DName;
  /** Kích thước px (vuông). */
  size?: number;
  className?: string;
  alt?: string;
}

/**
 * Icon emoji 3D (bộ Fluent Emoji của Microsoft, MIT — xem public/icons/LICENSE.txt).
 * Dùng thay icon line ở các vị trí trưng bày cho cảm giác "thật" và cao cấp hơn.
 */
export function Icon3D({ name, size = 48, className = '', alt = '' }: Icon3DProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/icons/${name}.png`}
      width={size}
      height={size}
      alt={alt}
      draggable={false}
      className={`select-none drop-shadow-[0_6px_16px_rgba(0,0,0,0.45)] ${className}`}
    />
  );
}
