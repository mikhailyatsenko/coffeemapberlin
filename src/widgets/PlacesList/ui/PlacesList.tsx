import { memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { type PlacesListProps } from 'widgets/PlacesList/types';
import { PlaceCard } from 'features/PlaceCard';
import { setShowFavorites, usePlacesStore } from 'shared/stores/places';
import cls from './PlacesList.module.scss';

const PlacesListComponent = ({ places }: PlacesListProps) => {
  const location = useLocation();

  const showFavorites = usePlacesStore((state) => state.showFavorites);
  const filteredPlaces = usePlacesStore((state) => state.filteredPlaces);

  const placeCards = useMemo(
    () =>
      places.map((place) => (
        <PlaceCard properties={place.properties} coordinates={place.geometry.coordinates} key={place.properties.id} />
      )),
    [places],
  );

  if (location.pathname === '/details' || filteredPlaces) {
    return null;
  }

  return (
    <>
      <div
        className={`${cls.placesListWrapper} ${showFavorites && location.pathname !== '/details' ? cls.showFavorites : ''}`}
      >
        <div className={`${cls.PlacesList}`}>{placeCards}</div>
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

export const PlacesList = memo(PlacesListComponent, (prev, next) => prev.places === next.places);
