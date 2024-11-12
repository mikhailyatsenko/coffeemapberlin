import { useState } from 'react';
import BeanIcon from './BeanIcon';
import cls from './RatingWidget.module.scss';

interface RatingWidgetProps {
  rating?: number | null;
  handleRating?: (rating: number) => void;
  isClickable: boolean;
  userRating?: number;
}

const RatingWidget: React.FC<RatingWidgetProps> = ({ rating, handleRating, isClickable }) => {
  const [hoverRating, setHoverRating] = useState<number>(0);

  const handleMouseEnter = (index: number) => {
    setHoverRating(index + 1);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleClick = (index: number) => {
    if (handleRating) {
      handleRating(index + 1);
    }
  };

  return (
    <div className={cls.rating}>
      {[...Array(5)].map((_, index) => {
        const fillValue = isClickable ? hoverRating : rating ?? 0;
        const filled = index < Math.floor(fillValue);
        const halfFilled = !filled && index < fillValue;

        return (
          <span
            key={index}
            className={cls.starWrapper}
            {...(isClickable && {
              onMouseEnter: () => {
                handleMouseEnter(index);
              },
              onMouseLeave: handleMouseLeave,
              onClick: () => {
                handleClick(index);
              },
              style: { cursor: 'pointer' },
            })}
          >
            <BeanIcon clickable={isClickable} filled={filled} />
            {halfFilled && (
              <div className={cls.halfStar}>
                <BeanIcon clickable={isClickable} filled={true} />
              </div>
            )}
          </span>
        );
      })}
      {isClickable && <div className={cls.hoveredRating}>{Boolean(hoverRating) && hoverRating}</div>}
    </div>
  );
};

export default RatingWidget;
