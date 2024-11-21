import { RegularButton } from 'shared/ui/RegularButton';
import cls from './LeaveOrEditMyReview.module.scss';

interface LeaveOrEditMyReviewProps {
  review?: string;
  leaveTextReviewHandler: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteMyTextReview: () => void;
}

export const LeaveOrEditMyReview = ({
  review = '',
  leaveTextReviewHandler,
  handleDeleteMyTextReview,
}: LeaveOrEditMyReviewProps) => {
  const formattedReview = review?.length > 15 ? `"${review.slice(0, 15)}..."` : `"${review}"`;

  return (
    <div className={cls.LeaveOrEditMyReview}>
      <RegularButton
        onClick={() => {
          leaveTextReviewHandler(true);
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
      {review && (
        <div className={cls.delReview}>
          ...or <span onClick={handleDeleteMyTextReview}>detete it</span>
        </div>
      )}
    </div>
  );
};
