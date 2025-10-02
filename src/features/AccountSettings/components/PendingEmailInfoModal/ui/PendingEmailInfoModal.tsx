import { Modal } from 'shared/ui/Modal';
import { PortalToBody } from 'shared/ui/Portals/PortalToBody';
import { RegularButton } from 'shared/ui/RegularButton';
import cls from './PendingEmailInfoModal.module.scss';

interface PendingEmailInfoModalProps {
  pendingEmail: string | null;
  onClose: () => void;
}

export const PendingEmailInfoModal = ({ pendingEmail, onClose }: PendingEmailInfoModalProps) => {
  return (
    <PortalToBody>
      <Modal onClose={onClose} closeOnEsc={true} widthOnDesktop={400}>
        <div className={cls.container}>
          <h3 className={cls.title}>Please check your email</h3>
          <p className={cls.text}>
            We&apos;ve sent a confirmation link to {pendingEmail ?? 'your email address'}. Please click the link to
            confirm your new email.
          </p>
          <p className={cls.text}>If you don&apos;t see the email, check your spam folder.</p>
          <div className={cls.actions}>
            <RegularButton onClick={onClose}>Close</RegularButton>
          </div>
        </div>
      </Modal>
    </PortalToBody>
  );
};
