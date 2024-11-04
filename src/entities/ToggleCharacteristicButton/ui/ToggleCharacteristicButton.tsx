import OutdoorIcon from '../../../shared/assets/chair-icon.svg?react';
import EatsIcon from '../../../shared/assets/eats-icon.svg?react';
import FilterCoffeIcon from '../../../shared/assets/filter-coffee-icon.svg?react';
import AtmosphereIcon from '../../../shared/assets/lamp-icon.svg?react';
import PetsIcon from '../../../shared/assets/pets-icon.svg?react';
import PriceIcon from '../../../shared/assets/price-icon.svg?react';
import StaffIcon from '../../../shared/assets/staff-icon.svg?react';
import WifiIcon from '../../../shared/assets/wifi-icon.svg?react';
import cls from './ToggleCharacteristicButton.module.scss';

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed: boolean;
  number: number;
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
        <OutdoorIcon width={'16'} height={'16'} />
      </div>
      {children}
    </button>
  );
};
