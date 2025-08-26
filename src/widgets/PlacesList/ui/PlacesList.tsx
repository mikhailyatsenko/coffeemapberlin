import clsx from 'clsx';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { FixedSizeList as List, VariableSizeList } from 'react-window';
import { type PlacesListProps } from 'widgets/PlacesList/types';
import { PlaceCard } from 'features/PlaceCard';
import { useWidth } from 'shared/hooks';
import { setShowFavorites, usePlacesStore } from 'shared/stores/places';
import { MOBILE_BREAKPOINT, MOBILE_ITEM_WIDTH } from '../constants';
import cls from './PlacesList.module.scss';

const PlacesListComponent = ({ places }: PlacesListProps) => {
  // Разделяем рефы: один для контейнера, другой для react-window
  const containerRef = useRef<HTMLDivElement | null>(null);
  const virtualListRef = useRef<List | VariableSizeList | null>(null);
  const showFavorites = usePlacesStore((state) => state.showFavorites);
  const filteredPlaces = usePlacesStore((state) => state.filteredPlaces);
  const width = useWidth();
  const isMobile = width <= MOBILE_BREAKPOINT;
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Кэш для высот элементов на десктопе
  const itemHeightsRef = useRef<Record<number, number>>({});
  const defaultItemHeight = 200; // дефолтная высота для десктопа

  useEffect(() => {
    const updateContainerSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({
          width: rect.width,
          height: rect.height || window.innerHeight - 200, // fallback высота
        });
      }
    };

    updateContainerSize();

    window.addEventListener('resize', updateContainerSize);

    return () => {
      window.removeEventListener('resize', updateContainerSize);
    };
  }, []);

  const getItemHeight = useCallback((index: number) => {
    return itemHeightsRef.current[index] || defaultItemHeight;
  }, []);

  // Функция для установки высоты элемента после рендера
  const setItemHeight = useCallback((index: number, height: number) => {
    itemHeightsRef.current[index] = height;
  }, []);

  // Компонент элемента для вертикальной прокрутки (десктоп)
  const VerticalItem = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const place = places[index];
    const itemRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (itemRef.current) {
        const height = itemRef.current.offsetHeight;
        if (height !== getItemHeight(index)) {
          setItemHeight(index, height);
          // Принудительно обновляем список если высота изменилась
          if (virtualListRef.current && 'resetAfterIndex' in virtualListRef.current) {
            virtualListRef.current.resetAfterIndex(index);
          }
        }
      }
    }, [index]);

    return (
      <div style={style}>
        <div ref={itemRef}>
          <PlaceCard index={index} properties={place.properties} coordinates={place.geometry.coordinates} />
        </div>
      </div>
    );
  };

  // Компонент элемента для горизонтальной прокрутки (мобильные)
  const HorizontalItem = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const place = places[index];

    return (
      <div style={style}>
        <div style={{ width: MOBILE_ITEM_WIDTH, height: '100%', padding: '0 8px' }}>
          <PlaceCard index={index} properties={place.properties} coordinates={place.geometry.coordinates} />
        </div>
      </div>
    );
  };

  // Виртуальный список без мемоизации
  const renderVirtualizedList = () => {
    if (!containerSize.width || !containerSize.height) {
      return null;
    }

    if (isMobile) {
      // Горизонтальная прокрутка для мобильных
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
          {HorizontalItem}
        </List>
      );
    } else {
      // Вертикальная прокрутка для десктопа с переменной высотой
      return (
        <VariableSizeList
          ref={virtualListRef as React.RefObject<VariableSizeList>}
          height={containerSize.height}
          width={containerSize.width}
          itemCount={places.length}
          itemSize={getItemHeight}
          className={cls.virtualizedList}
        >
          {VerticalItem}
        </VariableSizeList>
      );
    }
  };

  if (filteredPlaces) {
    return null;
  }

  return (
    <>
      <div className={clsx(cls.placesListWrapper, { [cls.showFavorites]: showFavorites })}>
        <div
          ref={containerRef}
          className={clsx(cls.PlacesList, {
            [cls.mobile]: isMobile,
            [cls.desktop]: !isMobile,
          })}
        >
          {renderVirtualizedList()}
        </div>
      </div>
      <div className={cls.backdrop}>
        <div
          onClick={() => {
            setShowFavorites(false);
          }}
          className={cls.closeButton}
        />
      </div>
    </>
  );
};

export const PlacesList = memo(
  PlacesListComponent,
  (prev, next) => prev.places === next.places && prev.isReady === next.isReady,
);
