import { formatDistanceToNow } from 'date-fns';
import BeanIcon from 'shared/ui/RatingWidget/ui/BeanIcon';
import DeleteIcon from '../../../assets/delete-icon.svg?react';
import EditIcon from '../../../assets/edit-icon.svg?react';
import cls from './ReviewCard.module.scss';

interface ReviewCardProps {
  id: string;
  userAvatar?: string;
  userName: string;
  reviewText?: string;
  rating?: number;
  isOwnReview?: boolean;
  handleDeleteReview?: (id: string) => void;
  setShowRateNow: React.Dispatch<React.SetStateAction<boolean>>;
  createdAt: string;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  id,
  userAvatar,
  userName,
  reviewText,
  rating,
  isOwnReview,
  handleDeleteReview,
  setShowRateNow,
  createdAt,
}) => {
  return (
    <div className={`${cls.reviewCard} ${isOwnReview ? cls.ownReview : ''}`}>
      {id === 'google' && <div className={cls.googleReviewInfo}>This review was imported from Google Maps.</div>}
      <div className={cls.userInfo}>
        <img
          src={userAvatar || (id === 'google' ? './google-maps.svg' : './user-default-icon.svg')}
          alt={userName}
          className={cls.avatar}
          referrerPolicy="no-referrer"
        />
        <span className={cls.userName}>{userName}</span>
        {rating && (
          <div className={cls.userRate}>
            <BeanIcon filled />
            <div className={cls.userRateNumber}>{rating}</div>
          </div>
        )}
      </div>

      <p className={cls.reviewText}>{!reviewText && rating ? `Rated: ${rating}` : reviewText}</p>

      <div className={cls.dateAndButtons}>
        <p className={cls.createdAt}>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</p>
        {isOwnReview && handleDeleteReview && (
          <div className={cls.buttons}>
            <EditIcon
              onClick={() => {
                setShowRateNow(true);
              }}
              className={cls.buttonIcon}
              title="Edit my feedback"
            />
            <DeleteIcon
              onClick={() => {
                const isConfirmed = window.confirm('Deleting review. Continue?');
                if (!isConfirmed) return;
                handleDeleteReview(id);
              }}
              className={cls.buttonIcon}
              title="Delete my review"
            />
          </div>
        )}
      </div>
    </div>
  );
};
