import cls from './ToggleCharacteristicButton.module.scss';

interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed: boolean; // Состояние кнопки (нажата/не нажата)
  onClick: () => void; // Обработчик клика
  name: string; // Имя кнопки
}
export const ToggleCharacteristicButton: React.FC<CustomButtonProps> = ({
  pressed,
  onClick,
  name,
  children,
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      className={`${cls.RegularButton} ${pressed ? cls.pressed : ''}`}
      {...props} // Передаем остальные стандартные пропсы
    >
      {children} {/* Отображаем имя и дочерние элементы */}
    </button>
  );
};
