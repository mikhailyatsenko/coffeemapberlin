import { FavoritesIndicator } from 'entities/FavoritesIndicator';
import { usePlaces } from 'shared/context/PlacesData/usePlaces';
import { useAuthStore } from 'shared/stores/auth';
import { PortalToBody } from 'shared/ui/Portals/PortalToBody';

export const ShowFavoritePlaces = () => {
  const { user } = useAuthStore();

  const { setShowFavorite, favoritePlaces } = usePlaces();
  if (!user) return null;

  if (favoritePlaces === null) return null;

  const onClickHandler = () => {
    setShowFavorite((prev) => !prev);
  };

  if (favoritePlaces.length > 0)
    return (
      <PortalToBody>
        <FavoritesIndicator favoritesQuantity={favoritePlaces.length} onClickHandler={onClickHandler} />
      </PortalToBody>
    );
};
