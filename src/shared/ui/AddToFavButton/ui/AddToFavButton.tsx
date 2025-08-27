import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useToggleFavoriteMutation } from 'shared/generated/graphql';
import { useAuthStore } from 'shared/stores/auth';
import { showLoginRequired } from 'shared/stores/modal';
import { toggleFavorite } from 'shared/stores/places';
import cls from './AddToFavButton.module.scss';

interface AddToFavButtonProps {
  placeId: string;
  placeName: string;
  isFavorite: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const AddToFavButton = ({ placeId, isFavorite, placeName, size = 'small' }: AddToFavButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [toggleFavoriteMutation] = useToggleFavoriteMutation({
    variables: { placeId },
    update: (cache, { data }) => {
      if (data?.toggleFavorite) {
        cache.modify({
          id: `PlaceProperties:${placeId}`,
          fields: {
            isFavorite(existing = false) {
              return !existing;
            },
          },
        });
      }
    },
    optimisticResponse: {
      toggleFavorite: true,
    },
  });

  const { user } = useAuthStore();

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      e.preventDefault();

      if (!user) {
        showLoginRequired();
        return;
      }

      if (isUpdating) return;

      setIsAnimating(true);
      setIsUpdating(true);

      try {
        if (navigator.vibrate) {
          navigator.vibrate(10);
        }

        const result = await toggleFavoriteMutation();
        if (result.data?.toggleFavorite) {
          toggleFavorite(placeId);

          if (!isFavorite) {
            toast.success(`${placeName} has been added to favorites`);
          } else {
            toast.success(`${placeName} has been removed from favorites`);
          }
        }
      } catch (error) {
        console.error('Error toggling favorite:', error);
        toast.error('Failed to update favorite status. Please try again.');
      } finally {
        setIsUpdating(false);
      }
    },
    [user, isUpdating, toggleFavoriteMutation, placeId, isFavorite, placeName],
  );

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
      className={clsx(cls.AddToFavButton, cls[size], {
        [cls.filled]: isFavorite,
        [cls.animate]: isAnimating,
        [cls.updating]: isUpdating,
      })}
      onClick={handleClick}
    ></div>
  );
};
