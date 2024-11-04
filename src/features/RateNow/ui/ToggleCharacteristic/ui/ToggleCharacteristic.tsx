import { useMutation } from '@apollo/client';
import { ToggleCharacteristicButton } from 'entities/ToggleCharacteristicButton';
import { TOGGLE_CHARACTERISTIC } from 'shared/query/apolloQueries';
import { type ICharacteristicCounts } from 'shared/types';
import { updateAllPlacesCache } from '../lib/updateAllPlacesCache';
import cls from './ToggleCharacteristic.module.scss';

interface ToggleCharacteristicButtonProps {
  placeId: string;
  characteristicCounts: ICharacteristicCounts;
}

interface ToggleCharacteristicVariables {
  placeId: string;
  characteristic: keyof ICharacteristicCounts;
}

export const ToggleCharacteristic: React.FC<ToggleCharacteristicButtonProps> = ({ placeId, characteristicCounts }) => {
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

  const [toggleCharacteristic, { error, loading }] = useMutation<
    { toggleCharacteristic: { success: boolean } },
    ToggleCharacteristicVariables
  >(TOGGLE_CHARACTERISTIC, {
    optimisticResponse: {
      toggleCharacteristic: {
        success: true,
      },
    },

    update(cache, _, { variables }) {
      const characteristic = variables?.characteristic;
      if (characteristic) {
        updateAllPlacesCache(cache, placeId, characteristic);
      }
    },
  });

  const handleToggle = async (charKey: keyof ICharacteristicCounts) => {
    try {
      await toggleCharacteristic({ variables: { placeId, characteristic: charKey } });
    } catch (err) {
      console.error('Error toggling characteristic:', err);
    }
  };

  return (
    <div className={cls.toggleCharacteristicButtons}>
      {Object.keys(characteristicCounts)
        .filter((charKey) => charKey !== '__typename')
        .map((charKey) => (
          <ToggleCharacteristicButton
            key={charKey}
            pressed={characteristicCounts[charKey as keyof ICharacteristicCounts].pressed}
            onClick={async () => {
              await handleToggle(charKey as keyof ICharacteristicCounts);
            }}
            name={charKey}
          >
            {characteristics.get(charKey)}
          </ToggleCharacteristicButton>
        ))}
      {error && <span style={{ color: 'red' }}>Error: {error.message}</span>}
      {loading && <span>Loading...</span>}
    </div>
  );
};
