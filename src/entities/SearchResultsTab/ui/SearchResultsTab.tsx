import { memo, useMemo, useCallback } from 'react';
import { FixedSizeList as List, type ListChildComponentProps } from 'react-window';
import { type GetPlacesQuery } from 'shared/generated/graphql';
import RatingWidget from 'shared/ui/RatingWidget/ui/RatingWidget';
import cls from './SearchResultsTab.module.scss';

interface SearchResultsTabProps {
  filteredPlaces: GetPlacesQuery['places']['places'];
  onSelect: (id: string) => void;
}

export const SearchResultsTab = memo(({ filteredPlaces, onSelect }: SearchResultsTabProps) => {
  // itemSize = card height (72px) + space between cards (4px) = 76px
  const itemSize = 76;
  const itemCount = filteredPlaces.length;
  const listHeight = useMemo(() => {
    const visibleItems = Math.min(itemCount, 8);
    return Math.max(visibleItems * itemSize, itemSize);
  }, [itemCount]);

  const Row = useCallback(
    ({ index, style }: ListChildComponentProps) => {
      const place = filteredPlaces[index];
      return (
        <div
          style={{
            ...style,
            height: '72px',
          }}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(place.properties.id);
          }}
          className={`${cls.resultPlace}`}
        >
          <div className={cls.placeName}>{place.properties.name}</div>
          <RatingWidget isClickable={false} rating={place.properties.averageRating} />
          <div className={cls.placeAddress}>{place.properties.address}</div>
        </div>
      );
    },
    [filteredPlaces, onSelect],
  );

  return (
    <div className={cls.SearchResultsTab}>
      <List height={listHeight} itemCount={itemCount} itemSize={itemSize} width="100%">
        {Row}
      </List>
    </div>
  );
});
