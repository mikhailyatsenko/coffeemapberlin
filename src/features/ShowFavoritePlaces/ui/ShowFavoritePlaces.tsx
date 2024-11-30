import { FavoritesIndicator } from 'entities/FavoritesIndicator';
import { useAuth } from 'shared/lib/reactContext/Auth/useAuth';
import { usePlaces } from 'shared/lib/reactContext/PlacesData/usePlaces';
import { PortalToBody } from 'shared/ui/Portals/PortalToBody';

export const ShowFavoritePlaces = () => {
  const { user } = useAuth();

  const { setShowFavorite, favoritePlaces } = usePlaces();
  if (!user) return null;

  if (favoritePlaces === null) return null;

  const onClickHandler = () => {
    setShowFavorite((prev) => !prev);
  };

  if (favoritePlaces.length > 0)
    return (
      <PortalToBody>
        <FavoritesIndicator favoritesQuantity={favoritePlaces.length} onClickHandler={onClickHandler} />;
      </PortalToBody>
    );
};
