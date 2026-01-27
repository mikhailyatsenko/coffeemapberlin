import { FavoritesIndicator } from 'entities/FavoritesIndicator';
import { setShowFavorites } from 'shared/stores/places';
import { type ShowFavoritePlacesProps } from '../types';
import cls from './ShowFavoritePlaces.module.scss';
export const ShowFavoritePlaces = ({ favoritesQuantity, showFavorites }: ShowFavoritePlacesProps) => {
  if (!favoritesQuantity) return null;

  const onClickHandler = () => {
    setShowFavorites(!showFavorites);
  };

  return showFavorites ? (
    <div className={cls.favoriteInfoFloat} onClick={onClickHandler}>
      <p>
        <b>Showing favorite places only.</b>
      </p>
      <span>Click here</span> to see all places.
    </div>
  ) : (
    <FavoritesIndicator favoritesQuantity={favoritesQuantity} onClickHandler={onClickHandler} />
  );
};
