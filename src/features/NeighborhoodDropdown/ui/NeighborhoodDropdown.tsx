import { NeighborhoodGrid, NeighborhoodGridCell } from 'entities/NeighborhoodGrid';
import { useAvailableNeighborhoodsQuery } from 'shared/generated/graphql';
import { useNeighborhoodPanel } from '../hooks/useNeighborhoodPanel';
import { type NeighborhoodDropdownProps } from '../types';
import cls from './NeighborhoodDropdown.module.scss';

export const NeighborhoodDropdown = ({ onSelect, isMobileMenuOpen }: NeighborhoodDropdownProps) => {
  const { isOpen, isMobile, panelRef, toggle, close } = useNeighborhoodPanel(isMobileMenuOpen);

  const { data, loading, error } = useAvailableNeighborhoodsQuery({
    fetchPolicy: 'cache-and-network',
  });

  const neighborhoods: string[] = data?.availableNeighborhoods.neighborhoods ?? [];

  const renderNeighborhoods = () => {
    if (loading && neighborhoods.length === 0) return <p className={cls.status}>Loading...</p>;
    if (error || neighborhoods.length === 0) return <p className={cls.status}>No neighborhoods</p>;

    return (
      <NeighborhoodGrid label="Neighborhoods">
        {neighborhoods.map((neighborhood) => (
          <NeighborhoodGridCell
            key={neighborhood}
            onClick={() => {
              onSelect(neighborhood);
              close();
            }}
          >
            {neighborhood}
          </NeighborhoodGridCell>
        ))}
      </NeighborhoodGrid>
    );
  };

  return (
    <div className={cls.dropdown} ref={panelRef}>
      <button
        className={cls.dropdownButton}
        onClick={toggle}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup={isMobile ? undefined : 'true'}
      >
        Neighborhoods
        <span className={cls.arrow} aria-hidden="true">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {isOpen && <div className={isMobile ? cls.inlinePanel : cls.dropdownPanel}>{renderNeighborhoods()}</div>}
    </div>
  );
};
