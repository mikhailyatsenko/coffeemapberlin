import { useEffect } from 'react';

export const ScrollToTop = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.scrollY !== 0) {
      window.scrollTo({ top: 0, left: 0 });
    }
  }, []);

  return null;
};
