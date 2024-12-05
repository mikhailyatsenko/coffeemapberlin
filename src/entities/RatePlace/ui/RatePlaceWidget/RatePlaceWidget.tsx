import { useEffect, useRef, useState } from 'react';
import DeleteIcon from 'shared/assets/delete-icon.svg?react';
import EditIcon from 'shared/assets/edit-icon.svg?react';
import BeanIcon from 'shared/ui/RatingWidget/ui/BeanIcon';
import RatingWidget from 'shared/ui/RatingWidget/ui/RatingWidget';
import cls from './RatePlaceWidget.module.scss';

interface RatePlaceWidgetProps {
  userRating?: number | null;
  reviewId?: string;
  onSubmitRating: (rating: number) => void;
  handleDeleteMyRating: () => void;
}

export const RatePlaceWidget = ({
  onSubmitRating,
  userRating,
  handleDeleteMyRating,
  reviewId,
}: RatePlaceWidgetProps) => {
  const [isEditRating, setIsEditRating] = useState(false);

  const ratingWidgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isEditRating && ratingWidgetRef.current && !ratingWidgetRef.current.contains(event.target as Node)) {
        setIsEditRating(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditRating]);

  return (
    <div className={cls.rateWidget}>
      {userRating && reviewId && !isEditRating ? (
        <>
          <h3>Your rating</h3>
          <div className={cls.currentUserRate}>
            <BeanIcon filled />
            <div className={cls.currentUserRateNumber}>{userRating}</div>
          </div>
          <div className={cls.delEditIcons}>
            <DeleteIcon className={cls.icon} onClick={handleDeleteMyRating} />
            <EditIcon
              className={cls.icon}
              onClick={() => {
                setIsEditRating(true);
              }}
            />
          </div>
        </>
      ) : (
        <>
          <h3>Rate this place</h3>
          <div ref={ratingWidgetRef}>
            <RatingWidget isClickable={true} handleRating={onSubmitRating} />
          </div>
        </>
      )}
    </div>
  );
};
