import { type Place } from 'shared/stores/places';

export interface PlacesListProps {
  places: Place[];
  isReady?: boolean;
}

export interface ContainerSizeManagerProps {
  children: (containerSize: { width: number; height: number }) => React.ReactNode;
}

export interface VirtualizedListProps {
  places: Place[];
  containerSize: {
    width: number;
    height: number;
  };
}

export interface VirtualizedItemProps {
  index: number;
  style: React.CSSProperties;
  place: Place;
  isMobile: boolean;
  onHeightChange?: (index: number, height: number) => void;
}
