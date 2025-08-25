import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useToggleFavoriteMutation } from 'shared/generated/graphql';
import { useAuthStore } from 'shared/stores/auth';
import { showLoginRequired } from 'shared/stores/modal';
import { toggleFavorite } from 'shared/stores/places';
import { cacheUpdate } from '../utils/cacheUpdate';
import cls from './AddToFavButton.module.scss';

interface AddToFavButtonProps {
  placeId: string;
  placeName: string;
  isFavorite: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const AddToFavButton = ({ placeId, isFavorite, placeName, size = 'small' }: AddToFavButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const [toggleFavoriteMutation] = useToggleFavoriteMutation({
    variables: { placeId },
  });

  const { user } = useAuthStore();
  const handleClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.preventDefault();

    if (!user) {
      showLoginRequired();
      return;
    }

    setIsAnimating(true);

    try {
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
      const result = await toggleFavoriteMutation();
      if (result.data?.toggleFavorite) {
        // zustand sore for all places
        toggleFavorite(placeId);
        // cache for Place query
        cacheUpdate(placeId);

        if (!isFavorite) {
          toast(`${placeName} has been added to favorites`);
        } else {
          toast(`${placeName} has been removed from favorites`);
        }
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
      className={`${cls.AddToFavButton} ${isFavorite ? `${cls.filled}` : ''} ${isAnimating ? cls.animate : ''} ${cls[size]}`}
      onClick={handleClick}
    ></div>
  );
};
