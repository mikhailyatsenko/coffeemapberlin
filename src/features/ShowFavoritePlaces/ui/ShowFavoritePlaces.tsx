import { FavoritesIndicator } from 'entities/FavoritesIndicator';
import { useAuth } from 'shared/lib/reactContext/Auth/useAuth';
import { usePlaces } from 'shared/lib/reactContext/PlacesData/usePlaces';

export const ShowFavoritePlaces = () => {
  const { user } = useAuth();

  const { setShowFavorite, favoritePlaces } = usePlaces();
  if (!user) return null;

  if (favoritePlaces === null) return null;

  const onClickHandler = () => {
    setShowFavorite((prev) => !prev);
  };
  console.log('favorite places:', favoritePlaces);
  return (
    <>
      {favoritePlaces.length > 0 && (
        <FavoritesIndicator favoritesQuantity={favoritePlaces.length} onClickHandler={onClickHandler} />
      )}
    </>
  );
};
