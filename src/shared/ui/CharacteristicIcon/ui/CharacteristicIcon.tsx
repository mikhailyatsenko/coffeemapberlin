import { ICON_CHAR_MAP } from 'shared/constants/iconCharMap';
import { characteristicsMap } from 'shared/ui/CharacteristicCountsIcon';
import cls from './CharacteristicIcon.module.scss';

interface CharacteristicCountsIconsProps {
  characteristic: string;
}

export const CharacteristicIcon = ({ characteristic }: CharacteristicCountsIconsProps) => {
  const IconComponent = ICON_CHAR_MAP[characteristic as keyof typeof ICON_CHAR_MAP];
  return (
    <div title={characteristicsMap.get(characteristic)} className={cls.CharacteristicCountsIcon}>
      <IconComponent className={cls.icon} />
    </div>
  );
};
