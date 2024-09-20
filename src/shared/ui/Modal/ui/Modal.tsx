import { type ReactNode, useEffect } from 'react';
import cls from './Modal.module.scss';

interface LoginPopupProps {
  children: ReactNode;
  onClose: () => void;
}

export const Modal = ({ children, onClose }: LoginPopupProps) => {
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose]);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Проверяем, был ли клик именно на оверлее
    if (event.currentTarget === event.target) {
      onClose();
    }
  };
  return (
    <div className={cls.overlay} onClick={handleOverlayClick}>
      <div className={cls.modal}>{children}</div>
    </div>
  );
};
