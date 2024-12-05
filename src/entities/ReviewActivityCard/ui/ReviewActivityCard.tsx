import { formatDistanceToNow } from 'date-fns';
import { createSearchParams, NavLink } from 'react-router-dom';
import BeanIcon from 'shared/ui/RatingWidget/ui/BeanIcon';
import { RegularButton } from 'shared/ui/RegularButton';
import cls from './ReviewActivityCard.module.scss';

interface ReviewActivityCardProps {
  averageRating: number | null;
  reviewText: string | null;
  placeName: string;
  userRating: number | null;
  createdAt: string;
  placeId: string;
}
export const ReviewActivityCard = ({
  placeName,
  reviewText,
  userRating,
  createdAt,
  placeId,
}: ReviewActivityCardProps) => {
  return (
    <div className={cls.ReviewActivityCard}>
      <p className={cls.createdAt}>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</p>
      <h3 className={cls.name}>{placeName}</h3>

      {userRating && (
        <div className={cls.ratingInfo}>
          <h3>My rating: </h3>
          <div className={cls.userRate}>
            <BeanIcon filled />
            <div className={cls.userRateNumber}>{userRating}</div>
          </div>
        </div>
      )}

      {reviewText && (
        <div className={cls.review}>
          <h3>My review:</h3>
          <p className={cls.reviewText}>&quot;{reviewText.trim()}&quot;</p>
        </div>
      )}

      <NavLink to={{ pathname: '/details', search: createSearchParams({ id: placeId }).toString() }}>
        <RegularButton>Open place&apos;s page</RegularButton>
      </NavLink>
    </div>
  );
};
