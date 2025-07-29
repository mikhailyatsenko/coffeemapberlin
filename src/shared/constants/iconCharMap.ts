import OutdoorIcon from '../assets/chair-icon.svg?react';
import EatsIcon from '../assets/eats-icon.svg?react';
import FilterCoffeeIcon from '../assets/filter-coffee-icon.svg?react';
import AtmosphereIcon from '../assets/lamp-icon.svg?react';
import PetsIcon from '../assets/pets-icon.svg?react';
import PriceIcon from '../assets/price-icon.svg?react';
import StaffIcon from '../assets/staff-icon.svg?react';
import WifiIcon from '../assets/wifi-icon.svg?react';

export const ICON_CHAR_MAP = {
  pleasantAtmosphere: AtmosphereIcon,
  friendlyStaff: StaffIcon,
  affordablePrices: PriceIcon,
  yummyEats: EatsIcon,
  deliciousFilterCoffee: FilterCoffeeIcon,
  freeWifi: WifiIcon,
  petFriendly: PetsIcon,
  outdoorSeating: OutdoorIcon,
} as const;
