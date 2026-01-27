import { memo } from 'react';
import cls from './FilterHeader.module.scss';

interface FilterHeaderProps {
  onClose: () => void;
}

const FilterHeaderComponent = ({ onClose }: FilterHeaderProps) => {
  return (
    <div className={cls.header}>
      <h2 className={cls.title}>Filters</h2>
      <button className={cls.closeButton} onClick={onClose} type="button" aria-label="Close filters">
        ×
      </button>
    </div>
  );
};

export const FilterHeader = memo(FilterHeaderComponent);
