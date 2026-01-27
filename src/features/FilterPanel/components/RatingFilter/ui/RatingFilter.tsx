import { memo } from 'react';
import { setMinRating } from 'shared/stores/filters';
import BeanIcon from 'shared/ui/RatingWidget/ui/BeanIcon';
import RatingWidget from 'shared/ui/RatingWidget/ui/RatingWidget';
import { RATING_OPTIONS } from '../../../constants';
import cls from './RatingFilter.module.scss';

interface RatingFilterProps {
  minRating: number;
}

const RatingFilterComponent = ({ minRating }: RatingFilterProps) => {
  return (
    <div className={cls.filterSection}>
      <div className={cls.titleSection}>
        <h3 className={cls.title}>Minimum Rating</h3>
        <div style={{ opacity: minRating === 0 ? 0 : 1 }}>
          <RatingWidget rating={minRating} isClickable={false} />
        </div>
      </div>
      <div className={cls.ratingOptions}>
        {RATING_OPTIONS.map((option) => (
          <button
            key={option.value}
            className={`${cls.ratingButton} ${minRating === option.value ? cls.selected : ''}`}
            onClick={() => {
              setMinRating(option.value);
            }}
            type="button"
          >
            {option.value !== 0 && (
              <BeanIcon filled={option.value === minRating} color={option.value === minRating ? '#fff' : ''} />
            )}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export const RatingFilter = memo(RatingFilterComponent);
