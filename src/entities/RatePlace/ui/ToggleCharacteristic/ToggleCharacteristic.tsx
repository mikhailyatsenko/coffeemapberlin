import { type ICharacteristicCounts } from 'shared/types';
import { ToggleCharacteristicButton } from '../ToggleCharacteristicButton/ToggleCharacteristicButton';
import cls from './ToggleCharacteristic.module.scss';

interface ToggleCharacteristicButtonProps {
  characteristicCounts: ICharacteristicCounts;
  toggleChar: (characteristic: keyof ICharacteristicCounts) => Promise<void>;
}

export const ToggleCharacteristic: React.FC<ToggleCharacteristicButtonProps> = ({
  characteristicCounts,
  toggleChar,
}) => {
  const characteristics = new Map<string, string>([
    ['pleasantAtmosphere', 'Pleasant Atmosphere'],
    ['friendlyStaff', 'Friendly Staff'],
    ['affordablePrices', 'Affordable Prices'],
    ['yummyEats', 'Yummy Eats'],
    ['deliciousFilterCoffee', 'Delicious Filter Coffee'],
    ['freeWifi', 'Free Wi-Fi'],
    ['petFriendly', 'Pet Friendly'],
    ['outdoorSeating', 'Outdoor Seating'],
  ]);

  return (
    <div className={cls.toggleCharacteristicButtons}>
      {Object.keys(characteristicCounts)
        .filter((charKey) => charKey !== '__typename')
        .map((charKey) => (
          <ToggleCharacteristicButton
            key={charKey}
            pressed={characteristicCounts[charKey as keyof ICharacteristicCounts].pressed}
            characteristic={charKey}
            onClick={async () => {
              await toggleChar(charKey as keyof ICharacteristicCounts);
            }}
          >
            {characteristics.get(charKey)}
          </ToggleCharacteristicButton>
        ))}
    </div>
  );
};
