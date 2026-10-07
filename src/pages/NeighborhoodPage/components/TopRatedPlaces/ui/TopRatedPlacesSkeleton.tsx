import { ShelfSkeleton } from '../../Shelf';
import { TOP_RATED_COLUMNS, TOP_RATED_SHELF_SIZE } from '../constants';

/** Top rated's shelf while the Places load; hide it from screen readers. */
export const TopRatedPlacesSkeleton = () => <ShelfSkeleton columns={TOP_RATED_COLUMNS} count={TOP_RATED_SHELF_SIZE} />;
