import { iconCharMap } from 'shared/lib/iconCharMap/iconCharMap';
import { type CharacteristicData } from 'shared/types';
import cls from './CharacteristicCountsIcon.module.scss';

interface CharacteristicCountsIconsProps {
  characteristic: string;
  characteristicData: CharacteristicData;
}

export const CharacteristicCountsIcon = ({ characteristic, characteristicData }: CharacteristicCountsIconsProps) => {
  const IconComponent = iconCharMap[characteristic as keyof typeof iconCharMap];
  return (
    <div className={`${cls.CharacteristicCountsIcon} ${characteristicData.pressed ? cls.pressed : ''}`}>
      <IconComponent />
      <div className={cls.count}>{characteristicData.count}</div>
    </div>
  );
};
