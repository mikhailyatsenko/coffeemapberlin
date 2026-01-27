import { useEffect, memo, useCallback } from 'react';
import { useGetAvailableTagsQuery } from 'shared/generated/graphql';
import { useWidth } from 'shared/hooks/useWidth';
import { resetFilters, setFilterPanelOpen, useFiltersStore } from 'shared/stores/filters';
import { PortalToBody } from 'shared/ui/Portals/PortalToBody';
import { FilterFooter } from '../components/FilterFooter';
import { FilterHeader } from '../components/FilterHeader';
import { NeighborhoodFilter } from '../components/NeighborhoodFilter';
import { RatingFilter } from '../components/RatingFilter';
import { TagsFilter } from '../components/TagsFilter';
import cls from './FilterPanel.module.scss';

interface FilterPanelProps {
  onApplyFilters: () => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

const FilterPanelComponent = ({ onApplyFilters, onResetFilters, hasActiveFilters }: FilterPanelProps) => {
  // Use separate selectors to avoid creating new objects on each render
  const isOpen = useFiltersStore((state) => state.isFilterPanelOpen);
  const minRating = useFiltersStore((state) => state.minRating);
  const neighborhood = useFiltersStore((state) => state.neighborhood);
  const selectedTags = useFiltersStore((state) => state.selectedTags);
  const width = useWidth();
  const isMobile = width <= 900;

  const { data: tagsData, loading: loadingTags } = useGetAvailableTagsQuery({ skip: !isOpen });
  const availableTags = tagsData?.availableAdditionalInfoTags?.tags || [];

  const handleClose = useCallback(() => {
    setFilterPanelOpen(false);
  }, []);

  const handleReset = useCallback(() => {
    resetFilters();
    onResetFilters();
  }, [onResetFilters]);

  const handleApply = useCallback(() => {
    onApplyFilters();
    handleClose();
  }, [onApplyFilters, handleClose]);

  const handlePanelClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const content = (
    <div className={cls.panel}>
      <FilterHeader onClose={handleClose} />

      <div className={cls.content}>
        <RatingFilter minRating={minRating} />
        <NeighborhoodFilter neighborhood={neighborhood} />
        {loadingTags ? 'Loading features...' : <TagsFilter availableTags={availableTags} selectedTags={selectedTags} />}
      </div>

      <FilterFooter hasActiveFilters={hasActiveFilters} onReset={handleReset} onApply={handleApply} />
    </div>
  );

  const panelClassName = isMobile ? cls.mobilePanel : cls.desktopPanel;

  return (
    <PortalToBody>
      <div className={cls.overlay} onClick={handleClose}>
        <div className={panelClassName} onClick={handlePanelClick}>
          {content}
        </div>
      </div>
    </PortalToBody>
  );
};

export const FilterPanel = memo(FilterPanelComponent);
