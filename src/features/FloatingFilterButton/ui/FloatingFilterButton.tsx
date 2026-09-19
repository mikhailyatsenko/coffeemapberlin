import { memo } from 'react';
import filterIcon from 'shared/assets/filter-icon.svg';
import { setFilterPanelOpen, useFiltersStore } from 'shared/stores/filters';
import cls from './FloatingFilterButton.module.scss';

interface FloatingFilterButtonProps {
  hasActiveFilters: boolean;
  inline?: boolean;
}

const FloatingFilterButtonComponent = ({ hasActiveFilters, inline = false }: FloatingFilterButtonProps) => {
  const isOpen = useFiltersStore((state) => state.isFilterPanelOpen);

  const handleClick = () => {
    setFilterPanelOpen(!isOpen);
  };

  return (
    <button
      className={`${cls.floatingButton} ${hasActiveFilters ? cls.active : ''} ${inline ? cls.inline : ''}`}
      onClick={handleClick}
      type="button"
      aria-label="Open filters"
    >
      <img src={filterIcon} alt="" className={cls.icon} />
      {hasActiveFilters && <span className={cls.badge} />}
    </button>
  );
};

export const FloatingFilterButton = memo(FloatingFilterButtonComponent);
