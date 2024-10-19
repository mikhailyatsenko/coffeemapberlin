import { FavoritesIndicator } from 'entities/FavoritesIndicator';
import { useAuth } from 'shared/lib/reactContext/Auth/useAuth';
import { usePlaces } from 'shared/lib/reactContext/PlacesData/usePlaces';

export const SwowFavoritePlaces = () => {
  const { user } = useAuth();
  const { setShowFavorite, favoritePlaces } = usePlaces();

  if (!user) return null;

  if (favoritePlaces === null) return null;

  const onClickHandler = () => {
    setShowFavorite((prev) => !prev);
  };

  return (
    <>
      {favoritePlaces.length > 0 && (
        <FavoritesIndicator favoritesQuantity={favoritePlaces.length} onClickHandler={onClickHandler} />
      )}
    </>
  );
};
