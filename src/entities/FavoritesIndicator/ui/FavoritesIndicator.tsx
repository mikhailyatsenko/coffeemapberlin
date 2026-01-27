import cls from './FavoritesIndicator.module.scss';

interface FavoritesIndicatorProps {
  favoritesQuantity: number;
  onClickHandler: () => void;
}

export const FavoritesIndicator = ({ favoritesQuantity, onClickHandler }: FavoritesIndicatorProps) => {
  return (
    <div className={cls.FavoritesIndicator} onClick={onClickHandler}>
      <div className={cls.favoritesNumber}>{favoritesQuantity}</div>
      <div className={cls.indicatorText}>
        Show {favoritesQuantity} {favoritesQuantity === 1 ? 'favorite place' : 'favorite places'}
      </div>
    </div>
  );
};
