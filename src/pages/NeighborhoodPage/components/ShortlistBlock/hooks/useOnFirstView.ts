import { type RefObject, useEffect, useRef } from 'react';

/** Calls `onView` the first time the element enters the viewport, and never again. */
export const useOnFirstView = (ref: RefObject<Element | null>, onView: () => void) => {
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
  }, [ref]);
};
