import { type ComponentType, type SVGProps } from 'react';
import OutdoorIcon from 'shared/assets/chair-icon.svg?react';
import EatsIcon from 'shared/assets/eats-icon.svg?react';
import PetsIcon from 'shared/assets/pets-icon.svg?react';
import WifiIcon from 'shared/assets/wifi-icon.svg?react';
import { ShortlistId } from 'shared/generated/graphql';

interface Amenity {
  /** The icon's accessible name and tooltip. */
  name: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

/** The icon for each Shortlist's Amenities, the same on every card and row. */
export const AMENITIES: Record<ShortlistId, Amenity> = {
  [ShortlistId.work]: { name: 'Good for work', Icon: WifiIcon },
  [ShortlistId.dogFriendly]: { name: 'Dog friendly', Icon: PetsIcon },
  [ShortlistId.outdoorSeating]: { name: 'Outdoor seating', Icon: OutdoorIcon },
  [ShortlistId.breakfastBrunch]: { name: 'Breakfast & brunch', Icon: EatsIcon },
};
