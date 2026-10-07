import { type RefObject, useEffect } from 'react';
import { scrollBehavior } from '../lib/scrollBehavior';

/**
 * On a phone the row scrolls sideways; keeps the current link in it. Scrolling only
 * the row, not the page, leaves a smooth page scroll from a tap running.
 */
export const useKeepCurrentInView = (listRef: RefObject<HTMLElement | null>, current: string | undefined) => {
  useEffect(() => {
    const list = listRef.current;
    const link = list?.querySelector<HTMLElement>('[aria-current]');
    if (!list || !link) return;
    const isCut =
      link.offsetLeft < list.scrollLeft || link.offsetLeft + link.offsetWidth > list.scrollLeft + list.clientWidth;
    if (!isCut) return;
    list.scrollTo?.({ left: link.offsetLeft - (list.clientWidth - link.offsetWidth) / 2, behavior: scrollBehavior() });
  }, [listRef, current]);
};
