export interface NeighborhoodDropdownProps {
  onSelect: (neighborhood: string) => void;
  /** Whether the mobile hamburger menu holding the picker is open; the inline grid collapses whenever it closes. */
  isMobileMenuOpen: boolean;
}
