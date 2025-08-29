import { memo, useRef, useCallback } from 'react';
import { FixedSizeList as List, VariableSizeList } from 'react-window';
import { useWidth } from 'shared/hooks';
import { MOBILE_BREAKPOINT, MOBILE_ITEM_WIDTH } from '../../../constants';
import { type VirtualizedListProps } from '../../../types';
import { VirtualizedItem } from '../../VirtualizedItem';
import cls from './VirtualizedList.module.scss';

const VirtualizedListComponent = ({ places, containerSize }: VirtualizedListProps) => {
  const virtualListRef = useRef<List | VariableSizeList | null>(null);
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

  if (!containerSize.width || !containerSize.height) {
    return null;
  }

  if (isMobile) {
    return (
      <List
        ref={virtualListRef as React.RefObject<List>}
        height={containerSize.height}
        width={containerSize.width}
        itemCount={places.length}
        itemSize={MOBILE_ITEM_WIDTH + 16}
        layout="horizontal"
        className={cls.virtualizedList}
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
