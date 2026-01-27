import { memo } from 'react';
import cls from './FilterFooter.module.scss';

interface FilterFooterProps {
  onReset: () => void;
  onApply: () => void;
}

const FilterFooterComponent = ({ onReset, onApply }: FilterFooterProps) => {
  return (
    <div className={cls.footer}>
      <button className={cls.resetButton} onClick={onReset} type="button">
        Reset
      </button>
      <button className={cls.applyButton} onClick={onApply} type="button">
        Apply Filters
      </button>
    </div>
  );
};

export const FilterFooter = memo(FilterFooterComponent);
