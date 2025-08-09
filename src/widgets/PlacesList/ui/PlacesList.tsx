import { useLocation } from 'react-router-dom';
import { type PlacesListProps } from 'widgets/PlacesList/types';
import { PlaceCard } from 'features/PlaceCard';
import { setShowFavorites, usePlacesStore } from 'shared/stores/places';
import cls from './PlacesList.module.scss';

export function PlacesList({ places }: PlacesListProps) {
  const location = useLocation();

  const showFavorites = usePlacesStore((state) => state.showFavorites);
  const filteredPlaces = usePlacesStore((state) => state.filteredPlaces);

  if (location.pathname === '/details' || filteredPlaces) {
    return null;
  }

  return (
    <>
      <div
        className={`${cls.placesData} ${showFavorites && location.pathname !== '/details' ? cls.showFavorites : ''}`}
      >
        <div className={`${cls.PlacesList}`}>
          {places.map((place, index) => (
            <PlaceCard
              properties={place.properties}
              coordinates={place.geometry.coordinates}
              key={place.properties.id}
              isLcpCandidate={index <= 5}
            />
          ))}
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
}
