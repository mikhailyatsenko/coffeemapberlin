import { memo, useRef, useEffect } from 'react';
import { PlaceCard } from 'features/PlaceCard';
import { MOBILE_ITEM_WIDTH } from '../../../constants';
import { type VirtualizedItemProps } from '../../../types';

const VirtualizedItemComponent = ({ index, style, place, isMobile, onHeightChange }: VirtualizedItemProps) => {
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMobile && itemRef.current && onHeightChange) {
      const height = itemRef.current.offsetHeight;
      onHeightChange(index, height);
    }
  }, [index, isMobile, onHeightChange]);

  if (isMobile) {
    return (
      <div style={style}>
        <div style={{ width: MOBILE_ITEM_WIDTH, height: '100%', padding: '0 8px' }}>
          <PlaceCard index={index} properties={place.properties} coordinates={place.geometry.coordinates} />
        </div>
      </div>
    );
  }

  return (
    <div style={style}>
      <div ref={itemRef}>
        <PlaceCard index={index} properties={place.properties} coordinates={place.geometry.coordinates} />
      </div>
    </div>
  );
};

export const VirtualizedItem = memo(VirtualizedItemComponent);
