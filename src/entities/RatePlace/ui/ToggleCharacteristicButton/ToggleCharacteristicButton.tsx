import { iconCharMap } from 'shared/lib/iconCharMap/iconCharMap';
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
  const IconComponent = iconCharMap[characteristic as keyof typeof iconCharMap];
  return (
    <button onClick={onClick} className={`${cls.buttonChar} ${pressed ? cls.pressed : ''}`} {...props}>
      <IconComponent className={cls.charIcon} width={'16'} height={'16'} />
      {children}
    </button>
  );
};
