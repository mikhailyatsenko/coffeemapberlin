import { type Characteristic } from 'shared/generated/graphql';
import { type ICharacteristicCounts } from 'shared/types';
import { characteristicsMap } from 'shared/ui/CharacteristicCountsIcon/ui/CharacteristicCountsIcon';
import { ToggleCharacteristicButton } from '../ToggleCharacteristicButton/ToggleCharacteristicButton';
import cls from './ToggleCharacteristic.module.scss';

interface ToggleCharacteristicButtonProps {
  characteristicCounts: ICharacteristicCounts;
  toggleChar: (characteristic: Characteristic) => Promise<void>;
}

export const ToggleCharacteristic: React.FC<ToggleCharacteristicButtonProps> = ({
  characteristicCounts,
  toggleChar,
}) => {
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
              await toggleChar(charKey as Characteristic);
            }}
          >
            {characteristicsMap.get(charKey)}
          </ToggleCharacteristicButton>
        ))}
    </div>
  );
};
