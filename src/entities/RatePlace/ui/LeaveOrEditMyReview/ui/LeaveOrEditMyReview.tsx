import { RegularButton } from 'shared/ui/RegularButton';
import cls from './LeaveOrEditMyReview.module.scss';

interface LeaveOrEditMyReviewProps {
  review?: string;
  buttonHandler: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LeaveOrEditMyReview = ({ review = '', buttonHandler }: LeaveOrEditMyReviewProps) => {
  const formattedReview = review?.length > 15 ? `"${review.slice(0, 15)}..."` : `"${review}"`;

  return (
    <RegularButton
      onClick={() => {
        buttonHandler(true);
      }}
    >
      {review ? (
        <>
          Edit my review: <span className={cls.formattedReview}>{formattedReview}</span>
        </>
      ) : (
        'Leave a text review'
      )}
    </RegularButton>
  );
};
