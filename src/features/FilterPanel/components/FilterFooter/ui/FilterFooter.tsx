import { memo } from 'react';
import cls from './FilterFooter.module.scss';

interface FilterFooterProps {
  hasActiveFilters: boolean;
  onReset: () => void;
  onApply: () => void;
}

const FilterFooterComponent = ({ hasActiveFilters, onReset, onApply }: FilterFooterProps) => {
  return (
    <div className={cls.footer}>
      <button className={cls.resetButton} disabled={!hasActiveFilters} onClick={onReset} type="button">
        Reset
      </button>
      <button className={cls.applyButton} onClick={onApply} type="button">
        Apply Filters
      </button>
    </div>
  );
};

export const FilterFooter = memo(FilterFooterComponent);
