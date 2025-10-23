import { formatDistanceToNow } from 'date-fns';
import { generatePath, useNavigate } from 'react-router-dom';
import { RoutePaths } from 'shared/constants';
import BeanIcon from 'shared/ui/RatingWidget/ui/BeanIcon';
import { RegularButton } from 'shared/ui/RegularButton';
import cls from './ReviewActivityCard.module.scss';

interface ReviewActivityCardProps {
  averageRating?: number;
  reviewText?: string;
  userRating?: number;
  placeName: string;
  createdAt?: string;
  placeId: string;
}
export const ReviewActivityCard = ({
  placeName,
  reviewText,
  userRating,
  createdAt,
  placeId,
}: ReviewActivityCardProps) => {
  const navigate = useNavigate();
  const onOpenPlaceClick = () => {
    const path = generatePath(`/${RoutePaths.placePage}`, { id: placeId });
    navigate({ pathname: path });
  };
  return (
    <div className={cls.ReviewActivityCard}>
      {createdAt && <p className={cls.createdAt}>{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}</p>}
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

      <RegularButton onClick={onOpenPlaceClick}>Open place&apos;s page</RegularButton>
    </div>
  );
};
