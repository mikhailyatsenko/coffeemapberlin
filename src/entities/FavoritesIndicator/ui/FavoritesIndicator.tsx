import { usePlaces } from 'shared/context/PlacesData/usePlaces';
import cls from './FavoritesIndicator.module.scss';

interface FavoritesIndicatorProps {
  favoritesQuantity: number;
  onClickHandler: () => void;
}

export const FavoritesIndicator = ({ favoritesQuantity, onClickHandler }: FavoritesIndicatorProps) => {
  const { showFavorites } = usePlaces();
  return !showFavorites ? (
    <div className={`${cls.FavoritesIndicator} ${!showFavorites ? cls.slideLeft : ''}`} onClick={onClickHandler}>
      <div className={cls.favoritesNumber}>{favoritesQuantity}</div>
      <div className={cls.indicatorText}>
        Show {favoritesQuantity} {favoritesQuantity === 1 ? 'favorite place' : 'favorite places'}
      </div>
    </div>
  ) : (
    <div className={`${cls.favoriteInfoFloat} ${showFavorites ? cls.appearEffect : ''}`} onClick={onClickHandler}>
      <p>
        <b>Showing favorite places only.</b>
      </p>
      <span>Click here</span> to see all places.
    </div>
  );
};
