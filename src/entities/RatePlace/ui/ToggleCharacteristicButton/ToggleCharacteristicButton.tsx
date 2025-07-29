import { ICON_CHAR_MAP } from 'shared/constants/iconCharMap';
import cls from './ToggleCharacteristicButton.module.scss';

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed: boolean;
  onClick: () => void;
  characteristic: string;
}

export const ToggleCharacteristicButton: React.FC<CustomButtonProps> = ({
  pressed,
  onClick,
  children,
  characteristic,
  ...props
}) => {
  const IconComponent = ICON_CHAR_MAP[characteristic as keyof typeof ICON_CHAR_MAP];
  return (
    <button onClick={onClick} className={`${cls.buttonChar} ${pressed ? cls.pressed : ''}`} {...props}>
      <IconComponent className={cls.charIcon} width={'16'} height={'16'} />
      {children}
    </button>
  );
};
