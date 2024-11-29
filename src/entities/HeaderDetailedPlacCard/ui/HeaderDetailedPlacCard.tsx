import RatingWidget from 'shared/ui/RatingWidget/ui/RatingWidget';
import cls from './HeaderDetailedPlacCard.module.scss';

interface HeaderDetailedPlacCardProps {
  isHeaderVisible: boolean;
  description: string;
  averageRating: number;
}

export const HeaderDetailedPlacCard = ({
  isHeaderVisible,
  averageRating,
  description,
}: HeaderDetailedPlacCardProps) => {
  return (
    <div className={`${cls.detailsHeader} ${!isHeaderVisible && cls.hideDetailsHeader}`}>
      <div className={cls.descriptionAndRating}>
        <div className={cls.ratingContainer}>
          {averageRating ? (
            <h4>Average Rating</h4>
          ) : (
            <p className={cls.noRatingText}>This place has not been rated yet</p>
          )}
          <div className={`${cls.ratingNumber} ${averageRating === 0 && cls.notActiveRating}`}>
            {averageRating}
            <span>/5</span>
          </div>
          <RatingWidget isClickable={false} rating={averageRating} />
        </div>
        {description && <div className={cls.description}>{description}</div>}
      </div>
    </div>
  );
};
