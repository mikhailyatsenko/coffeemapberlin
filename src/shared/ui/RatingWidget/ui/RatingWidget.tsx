import clsx from 'clsx';
import { useState } from 'react';
import BeanIcon from './BeanIcon';
import cls from './RatingWidget.module.scss';

interface RatingWidgetProps {
  rating?: number | null;
  handleRating?: (rating: number) => void;
  isClickable: boolean;
  /** Keeps the clickable look but ignores hover and clicks, e.g. while a Rating is saving. */
  disabled?: boolean;
  userRating?: number;
}

const RatingWidget: React.FC<RatingWidgetProps> = ({ rating, handleRating, isClickable, disabled = false }) => {
  const [hoverRating, setHoverRating] = useState<number>(0);

  const handleMouseEnter = (index: number) => {
    if (disabled) return;
    setHoverRating(index + 1);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleClick = (index: number) => {
    if (handleRating && !disabled) {
      handleRating(index + 1);
    }
  };

  return (
    <div className={clsx(cls.rating, disabled && cls.disabled)}>
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
              style: { cursor: disabled ? 'default' : 'pointer' },
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
