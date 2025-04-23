import { RegularButton } from 'shared/ui/RegularButton';
import cls from './LeaveOrEditMyReview.module.scss';

interface LeaveOrEditMyReviewProps {
  reviewText?: string;
  leaveTextReviewHandler: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteMyTextReview: () => void;
}

export const LeaveOrEditMyReview = ({
  reviewText,
  leaveTextReviewHandler,
  handleDeleteMyTextReview,
}: LeaveOrEditMyReviewProps) => {
  const formattedReview =
    reviewText && reviewText.length > 15 ? `"${reviewText.slice(0, 15)}..."` : `"${reviewText || ''}"`;

  return (
    <div className={cls.LeaveOrEditMyReview}>
      <RegularButton
        onClick={() => {
          leaveTextReviewHandler(true);
        }}
      >
        {reviewText ? (
          <>
            Edit my review: <span className={cls.formattedReview}>{formattedReview}</span>
          </>
        ) : (
          'Leave a text review'
        )}
      </RegularButton>
      {reviewText && (
        <div className={cls.delReview}>
          ...or <span onClick={handleDeleteMyTextReview}>detete it</span>
        </div>
      )}
    </div>
  );
};
