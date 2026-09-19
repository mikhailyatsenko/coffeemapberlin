import { ShowFavoritePlaces } from 'features/ShowFavoritePlaces';

import cls from './FloatingButtons.module.scss';

interface FloatingButtonsProps {
  favoritesQuantity: number;
  showFavorites: boolean;
}

export const FloatingButtons = ({ favoritesQuantity, showFavorites }: FloatingButtonsProps) => {
  const containerClassName = `${cls.container} ${favoritesQuantity > 0 && !showFavorites ? cls.slideLeft : ''} ${favoritesQuantity > 0 && showFavorites ? cls.appearEffect : ''}`;

  return (
    <div className={containerClassName}>
      {favoritesQuantity > 0 && (
        <ShowFavoritePlaces favoritesQuantity={favoritesQuantity} showFavorites={showFavorites} />
      )}
    </div>
  );
};
