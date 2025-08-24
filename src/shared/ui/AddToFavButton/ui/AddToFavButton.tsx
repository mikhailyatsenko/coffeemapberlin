import { useEffect, useState } from 'react';
import { useToggleFavoriteMutation } from 'shared/generated/graphql';
import cls from './AddToFavButton.module.scss';

interface AddToFavButtonProps {
  placeId: string;
  isFavorite: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const AddToFavButton = ({ placeId, isFavorite, size = 'small' }: AddToFavButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isCurrentFavorite, setIsCurrentFavorite] = useState(isFavorite);

  const [toggleFavoriteMutation] = useToggleFavoriteMutation({
    variables: { placeId },
  });

  const handleClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();
    setIsAnimating(true);

    try {
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
      const result = await toggleFavoriteMutation();
      if (result.data?.toggleFavorite) {
        setIsCurrentFavorite((prev) => !prev);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 760);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [isAnimating]);

  return (
    <div
      className={`${cls.AddToFavButton} ${isCurrentFavorite ? `${cls.filled}` : ''} ${isAnimating ? cls.animate : ''} ${cls[size]}`}
      onClick={handleClick}
    ></div>
  );
};
