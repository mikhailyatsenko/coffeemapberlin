import { memo } from 'react';
import { useAvailableNeighborhoodsQuery } from 'shared/generated/graphql';
import { setNeighborhood, toggleNeighborhood } from 'shared/stores/filters';
import cls from './NeighborhoodFilter.module.scss';

interface NeighborhoodFilterProps {
  neighborhood: string[];
}

const NeighborhoodFilterComponent = ({ neighborhood }: NeighborhoodFilterProps) => {
  const { data, loading } = useAvailableNeighborhoodsQuery();
  const availableNeighborhoods: string[] = data?.availableNeighborhoods.neighborhoods ?? [];

  return (
    <div className={cls.filterSection}>
      <h3 className={cls.sectionTitle}>Neighborhood</h3>
      <div className={cls.neighborhoodList}>
        {loading && <div className={cls.loading}>Loading neighborhoods...</div>}
        {!loading && availableNeighborhoods.length === 0 && <div className={cls.empty}>No neighborhoods available</div>}
        {!loading && (
          <>
            <button
              className={`${cls.neighborhoodButton} ${neighborhood.length === 0 ? cls.selected : ''}`}
              onClick={() => {
                setNeighborhood([]);
              }}
              type="button"
            >
              All
            </button>
            {availableNeighborhoods.map((n) => (
              <button
                key={n}
                className={`${cls.neighborhoodButton} ${neighborhood.includes(n) ? cls.selected : ''}`}
                onClick={() => {
                  toggleNeighborhood(n);
                }}
                type="button"
              >
                {n}
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export const NeighborhoodFilter = memo(NeighborhoodFilterComponent);
