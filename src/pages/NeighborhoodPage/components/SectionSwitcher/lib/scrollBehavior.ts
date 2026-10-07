/** Smooth scrolling, unless the person asked their system for reduced motion. */
export const scrollBehavior = (): ScrollBehavior =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
