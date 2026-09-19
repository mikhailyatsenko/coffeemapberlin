import { memo, useRef, useCallback, useEffect, useState } from 'react';
import { FixedSizeList as List, VariableSizeList } from 'react-window';
import { useWidth } from 'shared/hooks';
import { MOBILE_BREAKPOINT, MOBILE_ITEM_WIDTH } from '../../../constants';
import { type VirtualizedListProps } from '../../../types';
import { VirtualizedItem } from '../../VirtualizedItem';
import cls from './VirtualizedList.module.scss';

// Swipe hint on the mobile strip: peek at the next card, then return
const HINT_OFFSET = 80;
const HINT_DELAY = 1000;
const HINT_RETURN_DELAY = 400;

const SCROLL_STORAGE_KEY = 'scroll-list';

const VirtualizedListComponent = ({ places, containerSize }: VirtualizedListProps) => {
  const virtualListRef = useRef<List | VariableSizeList | null>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const width = useWidth();
  const isMobile = width <= MOBILE_BREAKPOINT;

  // Cache for element heights on desktop
  const itemHeightsRef = useRef<Record<number, number>>({});
  const defaultItemHeight = 144;

  const getItemHeight = useCallback((index: number) => {
    return itemHeightsRef.current[index] + 8 || defaultItemHeight;
  }, []);

  const setItemHeight = useCallback((index: number, height: number) => {
    itemHeightsRef.current[index] = height;

    // Force update the list if height changed
    if (virtualListRef.current && 'resetAfterIndex' in virtualListRef.current) {
      virtualListRef.current.resetAfterIndex(index);
    }
  }, []);

  // Simple scroll position management with debounce
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const saveScrollPosition = useCallback((scrollOffset: number) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      sessionStorage.setItem(SCROLL_STORAGE_KEY, String(scrollOffset));
    }, 100);
  }, []);

  // Restore scroll position on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const savedOffset = sessionStorage.getItem(SCROLL_STORAGE_KEY);
      if (virtualListRef.current) {
        if (savedOffset) {
          virtualListRef.current.scrollTo(parseInt(savedOffset, 10));
        }
      }
    }, 0);

    return () => {
      clearTimeout(timer);
      // Clear any pending save timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [isMobile]);

  // Only a fresh visit in this tab gets the hint; a saved position means the list was already used
  const [hasSavedOffset] = useState(() => sessionStorage.getItem(SCROLL_STORAGE_KEY) !== null);
  const hintDoneRef = useRef(false);
  const canHint = isMobile && places.length > 0 && containerSize.width > 0 && containerSize.height > 0;

  useEffect(() => {
    const scrollContainer = outerRef.current;
    if (!canHint || !scrollContainer || hasSavedOffset || hintDoneRef.current) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const timers: Array<ReturnType<typeof setTimeout>> = [];
    const stopListening = () => {
      scrollContainer.removeEventListener('touchstart', cancelHint);
      scrollContainer.removeEventListener('pointerdown', cancelHint);
    };
    // A touch during the hint leaves the list where the user put it
    function cancelHint() {
      timers.forEach(clearTimeout);
      stopListening();
    }

    timers.push(
      setTimeout(() => {
        hintDoneRef.current = true;
        if (scrollContainer.scrollLeft !== 0) return;

        scrollContainer.addEventListener('touchstart', cancelHint, { passive: true });
        scrollContainer.addEventListener('pointerdown', cancelHint);
        scrollContainer.scrollTo({ left: HINT_OFFSET, behavior: 'smooth' });
        timers.push(
          setTimeout(() => {
            stopListening();
            scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
          }, HINT_RETURN_DELAY),
        );
      }, HINT_DELAY),
    );

    return cancelHint;
  }, [canHint, hasSavedOffset]);

  if (!containerSize.width || !containerSize.height) {
    return null;
  }

  if (isMobile) {
    return (
      <List
        ref={virtualListRef as React.RefObject<List>}
        outerRef={outerRef}
        height={containerSize.height}
        width={containerSize.width}
        itemCount={places.length}
        itemSize={MOBILE_ITEM_WIDTH + 16}
        layout="horizontal"
        className={cls.virtualizedList}
        onScroll={({ scrollOffset }) => {
          saveScrollPosition(scrollOffset);
        }}
      >
        {({ index, style }) => (
          <VirtualizedItem
            index={index}
            style={style}
            place={places[index]}
            isMobile={true}
            onHeightChange={setItemHeight}
          />
        )}
      </List>
    );
  }

  return (
    <VariableSizeList
      ref={virtualListRef as React.RefObject<VariableSizeList>}
      height={containerSize.height}
      width={containerSize.width}
      itemCount={places.length}
      itemSize={getItemHeight}
      className={cls.virtualizedList}
      onScroll={({ scrollOffset }) => {
        saveScrollPosition(scrollOffset);
      }}
    >
      {({ index, style }) => (
        <VirtualizedItem
          index={index}
          style={style}
          place={places[index]}
          isMobile={false}
          onHeightChange={setItemHeight}
        />
      )}
    </VariableSizeList>
  );
};

export const VirtualizedList = memo(VirtualizedListComponent);
