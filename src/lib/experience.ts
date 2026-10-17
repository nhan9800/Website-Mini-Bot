export type ExperienceModel = 'robot' | 'vinyl' | 'headphones';
export type RobotMotion = 'Dance' | 'Wave';

/** Chặn delta lớn khi quay lại tab để animation không nhảy qua nhiều giây. */
export function animationDelta(delta: number): number {
  return Number.isFinite(delta) ? Math.max(0, Math.min(delta, 0.05)) : 0;
}

export const experienceAssets = {
  robot: '/models/mimi-robot.glb',
  headphones: '/models/headphones.glb',
} as const;
