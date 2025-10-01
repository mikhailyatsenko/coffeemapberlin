import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useToggleFavoriteMutation } from 'shared/generated/graphql';
import { useAuthStore } from 'shared/stores/auth';
import { useGuestFavoritesStore, markGuestInfoShown, toggleGuestFavorite } from 'shared/stores/guestFavorites';
import { showGuestFavoritesInfo } from 'shared/stores/modal';
import { toggleFavorite } from 'shared/stores/places';
import cls from './AddToFavButton.module.scss';

interface AddToFavButtonProps {
  placeId: string;
  placeName: string;
  isFavorite: boolean;
  size?: 'small' | 'medium' | 'large';
  theme: 'circle' | 'square';
}

export const AddToFavButton = ({ placeId, isFavorite, placeName, theme, size = 'small' }: AddToFavButtonProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [toggleFavoriteMutation] = useToggleFavoriteMutation({
    variables: { placeId },
    update: (cache, { data }) => {
      if (data?.toggleFavorite) {
        // Update Apollo cache for PlaceProperties
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
  });

  const { user } = useAuthStore();
  const guestFavIds = useGuestFavoritesStore((s) => s.ids);
  const infoShown = useGuestFavoritesStore((s) => s.infoShown);
  const effectiveIsFavorite = user ? isFavorite : guestFavIds.includes(placeId);

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      e.preventDefault();
      if (process.env.VITE_ENV !== 'development') {
        window.gtag('event', 'add_to_favorites_click', {
          item_id: placeId,
          item_name: 'click on favorites',
          category: 'engagement',
        });
      }

      if (!user) {
        setIsAnimating(true);
        toggleGuestFavorite(placeId);

        if (navigator.vibrate) {
          navigator.vibrate(10);
        }

        if (!effectiveIsFavorite) {
          toast.success(`${placeName} has been added to favorites`);
        } else {
          toast.success(`${placeName} has been removed from favorites`);
        }
        if (!infoShown) {
          markGuestInfoShown();
          showGuestFavoritesInfo();
        }
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
          if (!effectiveIsFavorite) {
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
    [user, isUpdating, toggleFavoriteMutation, placeId, effectiveIsFavorite, placeName, infoShown],
  );

  useEffect(() => {
    console.log('isAnimating', isAnimating);

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
    <button
      className={cls[theme]}
      onClick={handleClick}
      title={effectiveIsFavorite ? 'Remove this place from favorites' : 'Add this place to favorites'}
    >
      <div
        className={clsx(cls.AddToFavIcon, cls[size], {
          [cls.filled]: effectiveIsFavorite,
          [cls.animate]: isAnimating,
          [cls.updating]: isUpdating,
        })}
      ></div>
    </button>
  );
};
