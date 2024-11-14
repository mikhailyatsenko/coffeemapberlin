import { RegularButton } from 'shared/ui/RegularButton';
import cls from './LeaveOrEditMyReview.module.scss';

interface LeaveOrEditMyReviewProps {
  review?: string;
  buttonHandler: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LeaveOrEditMyReview = ({ review = '', buttonHandler }: LeaveOrEditMyReviewProps) => {
  const formattedReview = review?.length > 40 ? `${review.slice(0, 40)}...` : review;
  return (
    <div>
      <div className={cls.review}>{formattedReview}</div>
      <RegularButton
        clickHandler={() => {
          buttonHandler(true);
        }}
      >
        {review ? 'Edit my review' : 'Leave text a review'}
      </RegularButton>
    </div>
  );
};
