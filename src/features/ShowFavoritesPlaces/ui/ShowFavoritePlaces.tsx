import { usePlaces } from 'app/providers/PlacesDataProvider/ui/PlacesDataProvider';
import { FavoritesIndicator } from 'entities/FavoritesIndicator';
import { useAuth } from 'shared/lib/reactContext/Auth/useAuth';

export const ShowFavoritePlaces = () => {
  const { user } = useAuth();
  const { setShowFavorite, favoritePlaces } = usePlaces();

  if (!user) return null;

  if (favoritePlaces === null) return null;

  const onClickHandler = () => {
    setShowFavorite((prev) => !prev);
  };

  return (
    <>
      {favoritePlaces.length && (
        <FavoritesIndicator favoritesQuantity={favoritePlaces.length} onClickHandler={onClickHandler} />
      )}
    </>
  );
};
