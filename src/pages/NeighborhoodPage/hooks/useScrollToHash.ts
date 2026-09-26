import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Scrolls to the element the URL hash names once `isReady` turns true, once per
 * page view: the Shortlists aren't in the DOM before their data has loaded.
 */
export const useScrollToHash = (isReady: boolean) => {
  const { pathname, hash } = useLocation();
  const scrolledForRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!isReady || !hash || scrolledForRef.current === pathname) return;
    scrolledForRef.current = pathname;
    document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
  }, [isReady, pathname, hash]);
};
