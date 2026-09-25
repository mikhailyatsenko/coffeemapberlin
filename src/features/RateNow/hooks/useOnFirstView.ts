import { useEffect, useRef } from 'react';

/** Calls `onView` once, the first time the returned ref's element enters the viewport. */
export const useOnFirstView = <T extends Element>(onView: () => void) => {
  const ref = useRef<T>(null);
  // The latest callback, so a view reports the state at that moment without re-observing.
  const onViewRef = useRef(onView);
  useEffect(() => {
    onViewRef.current = onView;
  });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      onViewRef.current();
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, []);

  return ref;
};
