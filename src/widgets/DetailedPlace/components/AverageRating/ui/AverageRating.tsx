import RatingWidget from 'shared/ui/RatingWidget/ui/RatingWidget';
import cls from './AverageRating.module.scss';

interface AverageRatingProps {
  averageRating?: number | null;
}

export const AverageRating = ({ averageRating }: AverageRatingProps) => {
  return (
    <div className={cls.ratingContainer}>
      {averageRating ? <h4>Average Rating</h4> : <p className={cls.noRatingText}>This place has not been rated yet</p>}
      <div className={`${cls.ratingNumber} ${averageRating === 0 && cls.notActiveRating}`}>
        {averageRating}
        <span>/5</span>
      </div>
      <RatingWidget isClickable={false} rating={averageRating} />
    </div>
  );
};
