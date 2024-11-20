import BeanIcon from 'shared/ui/RatingWidget/ui/BeanIcon';
import RatingWidget from 'shared/ui/RatingWidget/ui/RatingWidget';
// import { RegularButton } from 'shared/ui/RegularButton';
import { RegularButton } from 'shared/ui/RegularButton';
import cls from './RatePlaceWidget.module.scss';

interface RatePlaceWidgetProps {
  userRating?: number;
  reviewId?: string;
  onSubmitRating: (rating: number) => void;
  handleDeleteReview: (
    reviewId: string,
    deleteOptions: 'deleteReviewText' | 'deleteRating' | 'deleteAll',
  ) => Promise<void> | undefined;
}

export const RatePlaceWidget = ({ onSubmitRating, userRating, handleDeleteReview, reviewId }: RatePlaceWidgetProps) => {
  return (
    <div className={cls.rateWidget}>
      {userRating && reviewId ? (
        <>
          <h3>Your rating</h3>
          <div className={cls.currentUserRate}>
            <BeanIcon filled />
            <div className={cls.currentUserRateNumber}>{userRating}</div>
          </div>
          <RegularButton onClick={async () => await handleDeleteReview(reviewId, 'deleteRating')} theme="blank">
            Delete my rating
          </RegularButton>
        </>
      ) : (
        <>
          <h3>Rate this place</h3>
          <RatingWidget isClickable={true} handleRating={onSubmitRating} />
        </>
      )}
    </div>
  );
};
