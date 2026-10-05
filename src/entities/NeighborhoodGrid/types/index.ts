import { type ReactNode } from 'react';

export interface NeighborhoodGridProps {
  /** Accessible name of the group, e.g. "Neighborhoods". */
  label: string;
  /** The grid's cells, usually `NeighborhoodGridCell`s. */
  children: ReactNode;
}

export interface NeighborhoodGridCellProps {
  children: ReactNode;
  onClick: () => void;
  /** Given, the cell is a toggle: it sets `aria-pressed` and shows as selected when true. */
  pressed?: boolean;
}
