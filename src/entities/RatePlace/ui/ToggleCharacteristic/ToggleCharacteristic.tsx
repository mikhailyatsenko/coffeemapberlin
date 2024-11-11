import { useToggleCharacteristic } from 'shared/lib/hooks/interactions/useToggleCharacteristic';
import { type ICharacteristicCounts } from 'shared/types';
import { ToggleCharacteristicButton } from '../ToggleCharacteristicButton/ToggleCharacteristicButton';
import cls from './ToggleCharacteristic.module.scss';

interface ToggleCharacteristicButtonProps {
  placeId: string;
  characteristicCounts: ICharacteristicCounts;
}

export const ToggleCharacteristic: React.FC<ToggleCharacteristicButtonProps> = ({ placeId, characteristicCounts }) => {
  const { toggleFavorite, error } = useToggleCharacteristic(placeId);
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
              await toggleFavorite(charKey as keyof ICharacteristicCounts);
            }}
          >
            {characteristics.get(charKey)}
          </ToggleCharacteristicButton>
        ))}
      {error && <span style={{ color: 'red' }}>Error: {error.message}</span>}
    </div>
  );
};
