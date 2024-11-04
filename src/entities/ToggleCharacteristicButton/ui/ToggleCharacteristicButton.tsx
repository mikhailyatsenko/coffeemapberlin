import MyIcon from '../../../shared/assets/pet-friendly-icon.svg?react';
import cls from './ToggleCharacteristicButton.module.scss';

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed: boolean;
  onClick: () => void;
  name: string;
}
export const ToggleCharacteristicButton: React.FC<CustomButtonProps> = ({
  pressed,
  onClick,
  name,
  children,
  ...props
}) => {
  return (
    <button onClick={onClick} className={`${cls.buttonChar} ${pressed ? cls.pressed : ''}`} {...props}>
      <div className={cls.charIcon}>
        <MyIcon />
      </div>
      {children}
    </button>
  );
};
