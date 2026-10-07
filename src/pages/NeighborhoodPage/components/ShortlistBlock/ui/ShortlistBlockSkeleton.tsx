import { ShelfSkeleton } from '../../Shelf';
import { SHORTLIST_SHELF_SIZE } from '../constants';

/** A Shortlist's shelf while the Places load; hide it from screen readers. */
export const ShortlistBlockSkeleton = () => (
  <ShelfSkeleton columns={SHORTLIST_SHELF_SIZE} count={SHORTLIST_SHELF_SIZE} />
);
