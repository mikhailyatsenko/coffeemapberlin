import clsx from 'clsx';
import { memo, useMemo, useRef } from 'react';
import { type PlacesListProps } from 'widgets/PlacesList/types';
import { PlaceCard } from 'features/PlaceCard';
// import { useWidth } from 'shared/hooks';
import { setShowFavorites, usePlacesStore } from 'shared/stores/places';
import cls from './PlacesList.module.scss';

const PlacesListComponent = ({ places }: PlacesListProps) => {
  const showFavorites = usePlacesStore((state) => state.showFavorites);
  const filteredPlaces = usePlacesStore((state) => state.filteredPlaces);
  const listRef = useRef<HTMLDivElement | null>(null);
  // const hasShownHintRef = useRef(false);

  const placeCards = useMemo(
    () =>
      places.map((place, index) => (
        <PlaceCard
          index={index}
          properties={place.properties}
          coordinates={place.geometry.coordinates}
          key={place.properties.id}
        />
      )),
    [places],
  );

  // const currentPlacePosition = usePlacesStore((state) => state.currentPlacePosition);

  // const screenWidth = useWidth();
  // hint for scroll possibility
  // useEffect(() => {
  //   if (!isReady || currentPlacePosition) return;
  //   if (typeof window === 'undefined') return;

  //   if (screenWidth > 767) return;

  //   const el = listRef.current;
  //   if (!el) return;

  //   const canScroll = el.scrollWidth > el.clientWidth;
  //   if (!canScroll) return;

  //   hasShownHintRef.current = true;

  //   const scrollDistance = 280;
  //   const startHint = () => {
  //     el.scrollTo({ left: scrollDistance, behavior: 'smooth' });
  //     const backTimer = window.setTimeout(() => {
  //       el.scrollTo({ left: 0, behavior: 'smooth' });
  //     }, 800);
  //     return backTimer;
  //   };

  //   const delay = 500; // small delay for layout settle
  //   const backTimerRef = { id: 0 as number | undefined };
  //   const timer = window.setTimeout(() => {
  //     backTimerRef.id = startHint() as unknown as number;
  //   }, delay);

  //   return () => {
  //     window.clearTimeout(timer);
  //     if (backTimerRef.id) window.clearTimeout(backTimerRef.id);
  //   };
  // }, [isReady, screenWidth, places.length, currentPlacePosition]);

  if (filteredPlaces) {
    return null;
  }

  return (
    <>
      <div className={clsx(cls.placesListWrapper, { [cls.showFavorites]: showFavorites })}>
        <div ref={listRef} className={clsx(cls.PlacesList)}>
          {placeCards}
        </div>
      </div>
      <div className={cls.backdrop}>
        <div
          onClick={() => {
            setShowFavorites(false);
          }}
          className={cls.closeButton}
        ></div>
      </div>
    </>
  );
};

export const PlacesList = memo(
  PlacesListComponent,
  (prev, next) => prev.places === next.places && prev.isReady === next.isReady,
);
