import { memo } from 'react';
import { resetFilters } from 'shared/stores/filters';
import cls from './EmptyFilterResults.module.scss';

interface EmptyFilterResultsProps {
  onResetFilters: () => void;
}

const EmptyFilterResultsComponent = ({ onResetFilters }: EmptyFilterResultsProps) => {
  const handleReset = () => {
    resetFilters();
    onResetFilters();
  };

  return (
    <div className={cls.container}>
      <div className={cls.content}>
        <div className={cls.icon}>🔍</div>
        <h3 className={cls.title}>No places found</h3>
        <p className={cls.message}>
          No places match your current filters. Try adjusting your search criteria or reset the filters to see all
          places.
        </p>
        <button className={cls.resetButton} onClick={handleReset} type="button">
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export const EmptyFilterResults = memo(EmptyFilterResultsComponent);
