import { formatDistanceToNow } from 'date-fns';
import BeanIcon from 'shared/ui/RatingWidget/ui/BeanIcon';
import DeleteIcon from '../../../assets/delete-icon.svg?react';
import cls from './ReviewCard.module.scss';

interface ReviewCardProps {
  id: string;
  userAvatar?: string;
  userName: string;
  reviewText?: string;
  rating?: number;
  isOwnReview?: boolean;
  handleDeleteReview?: (id: string) => void;
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
  createdAt,
}) => {
  return (
    <div className={cls.reviewCard}>
      <div className={cls.userInfo}>
        <img
          src={userAvatar || './user-default-icon.svg'}
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

      <div className={cls.dateAndDeleteButton}>
        <p className={cls.createdAt}>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</p>
        {isOwnReview && handleDeleteReview && (
          <button
            onClick={() => {
              handleDeleteReview(id);
            }}
            className={cls.deleteButton}
          >
            <DeleteIcon fill="#fff" height={14} width={14} />
            Delete
          </button>
        )}
      </div>
    </div>
  );
};
