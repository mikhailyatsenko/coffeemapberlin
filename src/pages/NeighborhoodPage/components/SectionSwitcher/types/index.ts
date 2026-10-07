import { type NeighborhoodSection } from '../../../types';

export interface SwitcherSection {
  /** Sent as `target` with `neighborhood_nav_click`. */
  target: NeighborhoodSection;
  /** The section's `id`. */
  anchor: string;
  label: string;
  /** How many Places the section holds; left out for Top rated. */
  count?: number;
}
