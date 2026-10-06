import { Link } from 'react-router-dom';
import { RoutePaths } from 'shared/constants';
import { showNeighborhoodOnMap } from '../../../model/showNeighborhoodOnMap';
import { formatNeighborhoodNumbers } from '../lib/formatNeighborhoodNumbers';
import { type NeighborhoodNumbers } from '../types';
import cls from './NeighborhoodHeader.module.scss';

interface NeighborhoodHeaderProps {
  /** The Neighborhood's name as the map's Filters know it. */
  neighborhood: string;
  /** Left out until the Places have loaded; the header then shows the title alone. */
  numbers?: NeighborhoodNumbers;
  /** Called on "Open on the map", before the map opens. */
  onMapOpen: () => void;
}

/** The page title, the Neighborhood's numbers and a link to all its Places on the map. */
export const NeighborhoodHeader = ({ neighborhood, numbers, onMapOpen }: NeighborhoodHeaderProps) => (
  <header className={cls.header}>
    <h1>Best Coffee Places in {neighborhood}</h1>
    {numbers && (
      <div className={cls.summary}>
        <p className={cls.numbers}>{formatNeighborhoodNumbers(numbers)}</p>
        <Link
          to={RoutePaths.main}
          className={cls.mapLink}
          onClick={() => {
            showNeighborhoodOnMap(neighborhood);
            onMapOpen();
          }}
        >
          Open on the map
        </Link>
      </div>
    )}
  </header>
);
