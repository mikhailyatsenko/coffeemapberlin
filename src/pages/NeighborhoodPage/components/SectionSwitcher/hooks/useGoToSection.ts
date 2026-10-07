import { type MouseEvent, useCallback } from 'react';
import { type NeighborhoodSection } from '../../../types';
import { scrollBehavior } from '../lib/scrollBehavior';
import { type SwitcherSection } from '../types';

/**
 * A click handler for a section's link: scrolls to the section, moves focus there
 * and calls `onNavigate`. A click that opens a new tab or window is left to the browser.
 */
export const useGoToSection = (onNavigate: (target: NeighborhoodSection) => void) =>
  useCallback(
    (event: MouseEvent<HTMLAnchorElement>, { anchor, target }: SwitcherSection) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const section = document.getElementById(anchor);
      if (!section) return;
      event.preventDefault();
      section.scrollIntoView({ behavior: scrollBehavior() });
      // Focus follows, so Tab and screen readers continue from the section.
      section.focus({ preventScroll: true });
      onNavigate(target);
    },
    [onNavigate],
  );
