import { type RefObject, useEffect, useState } from 'react';

// How many px the name is wider than its box (0 when it fits). Re-measured when the name
// changes (the virtualized list reuses cards by index), when the box resizes and once the
// web fonts load.
export const useNameOverflow = (nameRef: RefObject<HTMLElement | null>, name: string): number => {
  const [overflow, setOverflow] = useState(0);

  useEffect(() => {
    const element = nameRef.current;
    if (!element) return;

    let cancelled = false;
    const measure = () => {
      if (!cancelled) setOverflow(Math.max(0, element.scrollWidth - element.clientWidth));
    };

    measure();
    void document.fonts?.ready.then(measure);
    const resizeObserver = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(measure);
    resizeObserver?.observe(element);

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
    };
  }, [nameRef, name]);

  return overflow;
};
