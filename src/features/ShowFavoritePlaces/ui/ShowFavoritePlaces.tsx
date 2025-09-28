import { FavoritesIndicator } from 'entities/FavoritesIndicator';
import { setShowFavorites } from 'shared/stores/places';
import { PortalToBody } from 'shared/ui/Portals/PortalToBody';
import { type ShowFavoritePlacesProps } from '../types';

export const ShowFavoritePlaces = ({ favoritesQuantity, showFavorites }: ShowFavoritePlacesProps) => {
  if (!favoritesQuantity) return null;

  const onClickHandler = () => {
    setShowFavorites(!showFavorites);
  };

  return (
    <PortalToBody>
      <FavoritesIndicator favoritesQuantity={favoritesQuantity} onClickHandler={onClickHandler} />
    </PortalToBody>
  );
};
