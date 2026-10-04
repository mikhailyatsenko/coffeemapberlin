import { memo } from 'react';
import filterIcon from 'shared/assets/filter-icon.svg';
import { setFilterPanelOpen, useFiltersStore } from 'shared/stores/filters';
import cls from './FloatingFilterButton.module.scss';

interface FloatingFilterButtonProps {
  activeFilterCount: number;
  inline?: boolean;
}

const FloatingFilterButtonComponent = ({ activeFilterCount, inline = false }: FloatingFilterButtonProps) => {
  const isOpen = useFiltersStore((state) => state.isFilterPanelOpen);
  const hasActiveFilters = activeFilterCount > 0;

  const handleClick = () => {
    setFilterPanelOpen(!isOpen);
  };

  return (
    <button
      className={`${cls.floatingButton} ${hasActiveFilters ? cls.active : ''} ${inline ? cls.inline : ''}`}
      onClick={handleClick}
      type="button"
      aria-label={hasActiveFilters ? `Open filters, ${activeFilterCount} active` : 'Open filters'}
    >
      <img src={filterIcon} alt="" className={cls.icon} />
      {hasActiveFilters && <span className={cls.badge}>{activeFilterCount}</span>}
    </button>
  );
};

export const FloatingFilterButton = memo(FloatingFilterButtonComponent);
