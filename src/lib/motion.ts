export const MOTION = {
  duration: {
    fast: 0.14,
    med: 0.26,
    slow: 0.52,
    page: 0.32,
  },
  ease: {
    out: [0.22, 1, 0.36, 1] as const,
    inOut: [0.65, 0, 0.35, 1] as const,
    in: [0.4, 0, 1, 1] as const,
  },
};
