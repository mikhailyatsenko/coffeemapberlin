import { ICON_CHAR_MAP } from 'shared/constants/iconCharMap';
import { type CharacteristicData } from 'shared/types';
import cls from './CharacteristicCountsIcon.module.scss';

interface CharacteristicCountsIconsProps {
  characteristic: string;
  characteristicData: CharacteristicData;
}

export const characteristicsMap = new Map<string, string>([
  ['pleasantAtmosphere', 'Pleasant Atmosphere'],
  ['friendlyStaff', 'Friendly Staff'],
  ['affordablePrices', 'Affordable Prices'],
  ['yummyEats', 'Yummy Eats'],
  ['deliciousFilterCoffee', 'Delicious Filter Coffee'],
  ['freeWifi', 'Free Wi-Fi'],
  ['petFriendly', 'Pet Friendly'],
  ['outdoorSeating', 'Outdoor Seating'],
]);

export const CharacteristicCountsIcon = ({ characteristic, characteristicData }: CharacteristicCountsIconsProps) => {
  const IconComponent = ICON_CHAR_MAP[characteristic as keyof typeof ICON_CHAR_MAP];
  if (characteristicData.count === 0) return null;
  return (
    <div
      title={characteristicsMap.get(characteristic)}
      className={`${cls.CharacteristicCountsIcon} ${characteristicData.pressed ? cls.pressed : ''}`}
    >
      <IconComponent className={cls.icon} />
      <div className={cls.count}>{characteristicData.count}</div>
    </div>
  );
};
