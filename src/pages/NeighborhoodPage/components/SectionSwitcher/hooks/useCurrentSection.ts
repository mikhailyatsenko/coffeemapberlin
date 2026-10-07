import { useEffect, useState } from 'react';
import { CURRENT_SECTION_BAND } from '../constants';

/**
 * The anchor of the section in view: the first, in page order, that crosses the
 * band. Between sections the last one stays current, so the highlight doesn't flicker.
 */
export const useCurrentSection = (anchors: readonly string[]) => {
  const [current, setCurrent] = useState<string>();
  const anchorsKey = anchors.join(' ');

  useEffect(() => {
    const ordered = anchorsKey.split(' ');
    const inView = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const { target, isIntersecting } of entries) {
          if (isIntersecting) inView.add(target.id);
          else inView.delete(target.id);
        }
        const first = ordered.find((anchor) => inView.has(anchor));
        if (first) setCurrent(first);
      },
      { rootMargin: CURRENT_SECTION_BAND },
    );
    for (const anchor of ordered) {
      const section = document.getElementById(anchor);
      if (section) observer.observe(section);
    }
    return () => {
      observer.disconnect();
    };
  }, [anchorsKey]);

  return current;
};
