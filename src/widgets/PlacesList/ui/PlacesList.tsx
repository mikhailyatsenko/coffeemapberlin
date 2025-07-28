import { useLocation } from 'react-router-dom';
import { type PlacesListProps } from 'widgets/PlacesList/types';
import { PlaceCard } from 'features/PlaceCard';
import { setShowFavorites, usePlacesStore } from 'shared/stores/places';
import cls from './PlacesList.module.scss';

export function PlacesList({ places }: PlacesListProps) {
  const location = useLocation();

  const showFavorites = usePlacesStore((state) => state.showFavorites);
  const filteredPlaces = usePlacesStore((state) => state.filteredPlaces);

  return (
    (!filteredPlaces || location.pathname !== '/details') && (
      <>
        <div
          className={`${cls.placesData} ${showFavorites && location.pathname !== '/details' ? cls.showFavorites : ''}`}
        >
          <div className={`${cls.PlacesList} ${location.pathname === '/details' ? cls.detailsOpen : ''}`}>
            {places.map((place) => (
              <PlaceCard
                properties={place.properties}
                coordinates={place.geometry.coordinates}
                key={place.properties.id}
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
    )
  );
}
