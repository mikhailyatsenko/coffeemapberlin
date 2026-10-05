import { memo } from 'react';
import { NeighborhoodGrid, NeighborhoodGridCell } from 'entities/NeighborhoodGrid';
import { useAvailableNeighborhoodsQuery } from 'shared/generated/graphql';
import { setNeighborhood, toggleNeighborhood } from 'shared/stores/filters';
import cls from './NeighborhoodFilter.module.scss';

interface NeighborhoodFilterProps {
  neighborhood: string[];
}

const NeighborhoodFilterComponent = ({ neighborhood }: NeighborhoodFilterProps) => {
  const { data, loading, error } = useAvailableNeighborhoodsQuery();
  const availableNeighborhoods: string[] = data?.availableNeighborhoods.neighborhoods ?? [];

  const renderNeighborhoods = () => {
    if (loading) return <p className={cls.status}>Loading neighborhoods...</p>;
    if (error || availableNeighborhoods.length === 0) return <p className={cls.status}>No neighborhoods available</p>;

    return (
      <NeighborhoodGrid label="Neighborhood">
        <NeighborhoodGridCell
          pressed={neighborhood.length === 0}
          onClick={() => {
            setNeighborhood([]);
          }}
        >
          All
        </NeighborhoodGridCell>
        {availableNeighborhoods.map((name) => (
          <NeighborhoodGridCell
            key={name}
            pressed={neighborhood.includes(name)}
            onClick={() => {
              toggleNeighborhood(name);
            }}
          >
            {name}
          </NeighborhoodGridCell>
        ))}
      </NeighborhoodGrid>
    );
  };

  return (
    <div className={cls.filterSection}>
      <h3 className={cls.sectionTitle}>Neighborhood</h3>
      {renderNeighborhoods()}
    </div>
  );
};

export const NeighborhoodFilter = memo(NeighborhoodFilterComponent);
