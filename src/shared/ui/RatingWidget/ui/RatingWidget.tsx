import clsx from 'clsx';
import { type KeyboardEvent, useRef, useState } from 'react';
import BeanIcon from './BeanIcon';
import cls from './RatingWidget.module.scss';

const MAX_RATING = 5;

interface RatingWidgetProps {
  rating?: number | null;
  handleRating?: (rating: number) => void;
  /** Clickable beans form a "Rating" radio group: Tab reaches it, arrows move, Enter/Space or a click choose. */
  isClickable: boolean;
  /** Keeps the clickable look but ignores hover and clicks, e.g. while a Rating is saving. */
  disabled?: boolean;
}

const RatingWidget: React.FC<RatingWidgetProps> = ({ rating, handleRating, isClickable, disabled = false }) => {
  const checkedRating = rating ? Math.round(rating) : 0;
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [focusedRating, setFocusedRating] = useState<number>(0);
  // The one bean in the tab order (roving tabindex): the last focused, else the current value, else the first.
  const [tabStopRating, setTabStopRating] = useState<number>(checkedRating || 1);
  // A click also focuses the bean; only keyboard focus should preview, so the fill still clears on mouse leave.
  const isPointerFocus = useRef(false);
  const beanRefs = useRef<Array<HTMLSpanElement | null>>([]);

  const handleMouseEnter = (value: number) => {
    if (disabled) return;
    setHoverRating(value);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  const handleClick = (value: number) => {
    if (handleRating && !disabled) {
      handleRating(value);
    }
  };

  const handleFocus = (value: number) => {
    setTabStopRating(value);
    if (!disabled && !isPointerFocus.current) setFocusedRating(value);
    isPointerFocus.current = false;
  };

  const moveFocus = (value: number) => {
    const wrapped = ((value - 1 + MAX_RATING) % MAX_RATING) + 1;
    beanRefs.current[wrapped - 1]?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>, value: number) => {
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        moveFocus(value + 1);
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        moveFocus(value - 1);
        break;
      case 'Home':
        moveFocus(1);
        break;
      case 'End':
        moveFocus(MAX_RATING);
        break;
      case 'Enter':
      case ' ':
        handleClick(value);
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  const previewRating = hoverRating || focusedRating;
  const fillValue = isClickable ? previewRating : rating ?? 0;

  return (
    <div
      className={clsx(cls.rating, disabled && cls.disabled)}
      {...(isClickable && { role: 'radiogroup', 'aria-label': 'Rating', 'aria-disabled': disabled || undefined })}
    >
      {[...Array(MAX_RATING)].map((_, index) => {
        const value = index + 1;
        const filled = index < Math.floor(fillValue);
        const halfFilled = !filled && index < fillValue;

        return (
          <span
            key={index}
            className={cls.starWrapper}
            {...(isClickable && {
              ref: (element: HTMLSpanElement | null) => {
                beanRefs.current[index] = element;
              },
              role: 'radio',
              'aria-label': `${value} of ${MAX_RATING}`,
              'aria-checked': value === checkedRating,
              tabIndex: value === tabStopRating ? 0 : -1,
              onMouseEnter: () => {
                handleMouseEnter(value);
              },
              onMouseLeave: handleMouseLeave,
              onPointerDown: () => {
                isPointerFocus.current = true;
              },
              onClick: () => {
                handleClick(value);
              },
              onFocus: () => {
                handleFocus(value);
              },
              onBlur: () => {
                setFocusedRating(0);
              },
              onKeyDown: (event: KeyboardEvent<HTMLSpanElement>) => {
                handleKeyDown(event, value);
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
      {isClickable && (
        <div className={cls.hoveredRating} aria-hidden="true">
          {Boolean(previewRating) && previewRating}
        </div>
      )}
    </div>
  );
};

export default RatingWidget;
