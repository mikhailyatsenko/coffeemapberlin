/**
 * The single way to send a GA event. Events from anywhere but production are
 * dropped, so local testing doesn't pollute the numbers.
 */
export const trackEvent = (name: string, params?: Record<string, unknown>) => {
  if (process.env.VITE_ENV !== 'production') return;
  window.gtag('event', name, params);
};
