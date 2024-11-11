import { type ReactNode, useEffect } from 'react';
import cls from './Modal.module.scss';

interface LoginPopupProps {
  children: ReactNode;
  onClose: () => void;
  desctopWidth?: 400 | 600 | 800;
}

export const Modal = ({ children, onClose, desctopWidth = 400 }: LoginPopupProps) => {
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
    if (event.currentTarget === event.target) {
      onClose();
    }
  };
  return (
    <div className={cls.overlay} onClick={handleOverlayClick}>
      <div style={{ maxWidth: desctopWidth }} className={cls.modal}>
        <div onClick={onClose} className={cls.close}></div>
        {children}
      </div>
    </div>
  );
};
