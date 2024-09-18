import { useLocation } from 'react-router-dom';
import { usePlaces } from 'app/providers/PlacesDataProvider/ui/PlacesDataProvider';
import { PlaceCard } from 'features/PlaceCard';
import cls from './PlacesList.module.scss';

export function PlacesList() {
  const location = useLocation();
  const { filterablePlaces, favoritePlaces, showFavorites } = usePlaces();
  const { searchTerm, setShowFavorite } = usePlaces();

  if (!filterablePlaces.length) return null;

  console.log(filterablePlaces.map((place) => 'https://3welle.com/details?id=' + place.properties.id));

  return (
    !searchTerm && (
      <>
        <div
          className={`${cls.placesData} ${showFavorites && favoritePlaces?.length && location.pathname !== '/details' ? cls.showFavorites : ''}`}
        >
          <div className={`${cls.PlacesList} ${location.pathname === '/details' ? cls.detailsOpen : ''}`}>
            {(showFavorites && favoritePlaces?.length ? favoritePlaces : filterablePlaces).map((place) => (
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
              setShowFavorite(false);
            }}
            className={cls.closeButton}
          ></div>
        </div>
      </>
    )
  );
}
