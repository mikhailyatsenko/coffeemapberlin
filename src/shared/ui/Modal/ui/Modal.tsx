import { type ReactNode, useEffect } from 'react';
import cls from './Modal.module.scss';

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  widthOnDesktop?: 400 | 600 | 800;
  closeOnEsc?: boolean;
}

export const Modal = ({ children, onClose, widthOnDesktop = 400, closeOnEsc = false }: ModalProps) => {
  useEffect(() => {
    if (!closeOnEsc) return;

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [onClose, closeOnEsc]);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.currentTarget === event.target) {
      onClose();
    }
  };
  return (
    <div className={cls.overlay} onClick={handleOverlayClick}>
      <div style={{ maxWidth: widthOnDesktop }} className={cls.modal}>
        <div onClick={onClose} className={cls.close}></div>
        {children}
      </div>
    </div>
  );
};
