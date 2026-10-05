import { useEffect, useRef, useState } from 'react';
import { useWidth } from 'shared/hooks/useWidth';

/**
 * Open state of the Neighborhoods panel: a dropdown closed by a click outside on desktop,
 * an inline disclosure collapsed with the menu on mobile.
 */
export const useNeighborhoodPanel = (isMobileMenuOpen: boolean) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const isMobile = useWidth() <= 900;

  // The menu is slid off-screen, not unmounted, so the inline grid would otherwise stay expanded across a close.
  useEffect(() => {
    if (!isMobileMenuOpen) setIsOpen(false);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isMobile) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile]);

  return {
    isOpen,
    isMobile,
    panelRef,
    toggle: () => {
      setIsOpen((prev) => !prev);
    },
    close: () => {
      setIsOpen(false);
    },
  };
};
