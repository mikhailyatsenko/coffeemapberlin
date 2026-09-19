import { useEffect } from 'react';

const CSS_VAR = '--keyboard-inset';

/**
 * While `active`, exposes the height of the on-screen keyboard as the `--keyboard-inset`
 * CSS variable on <html>, so fixed bottom elements can be lifted above it.
 * Mobile browsers (iOS Safari, Chrome by default) shrink only the visual viewport
 * when the keyboard opens, leaving `bottom: 0` elements hidden behind it.
 */
export const useKeyboardInset = (active: boolean) => {
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!active || !viewport) {
      return;
    }

    const root = document.documentElement;
    const update = () => {
      const inset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      root.style.setProperty(CSS_VAR, `${Math.round(inset)}px`);
    };

    update();
    viewport.addEventListener('resize', update);
    viewport.addEventListener('scroll', update);

    return () => {
      viewport.removeEventListener('resize', update);
      viewport.removeEventListener('scroll', update);
      root.style.removeProperty(CSS_VAR);
    };
  }, [active]);
};
