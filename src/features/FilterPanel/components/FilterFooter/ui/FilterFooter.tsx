import clsx from 'clsx';
import { memo } from 'react';
import { type ResultCount } from '../../../types/resultCount';
import cls from './FilterFooter.module.scss';

interface FilterFooterProps {
  hasActiveFilters: boolean;
  resultCount: ResultCount;
  onReset: () => void;
  onApply: () => void;
}

const ResultCountText = ({ resultCount }: { resultCount: ResultCount }) => {
  if (resultCount.status === 'counting') return 'Counting places…';
  if (resultCount.status === 'unavailable') return null;
  if (resultCount.total === 0) {
    return (
      <>
        No places match these filters
        <span className={cls.hint}>Try removing a feature or lowering the rating</span>
      </>
    );
  }
  return resultCount.total === 1 ? '1 place matches' : `${resultCount.total} places match`;
};

const FilterFooterComponent = ({ hasActiveFilters, resultCount, onReset, onApply }: FilterFooterProps) => {
  const isUpdating = resultCount.status === 'ready' && resultCount.isUpdating;

  return (
    <div className={cls.footer}>
      <p className={clsx(cls.resultCount, isUpdating && cls.updating)} role="status" aria-busy={isUpdating}>
        <ResultCountText resultCount={resultCount} />
      </p>
      <div className={cls.actions}>
        <button className={cls.resetButton} disabled={!hasActiveFilters} onClick={onReset} type="button">
          Reset
        </button>
        <button className={cls.applyButton} onClick={onApply} type="button">
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export const FilterFooter = memo(FilterFooterComponent);
