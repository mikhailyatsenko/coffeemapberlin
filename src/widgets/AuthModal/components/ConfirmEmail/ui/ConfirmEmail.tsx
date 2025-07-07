import { RegularButton } from 'shared/ui/RegularButton';
import cls from './ConfirmEmail.module.scss';

interface ConfirmEmailProps {
  hideAuthModal: () => void;
}

export const ConfirmEmail = ({ hideAuthModal }: ConfirmEmailProps) => {
  return (
    <div className={cls.content}>
      <h3>Please check your email</h3>

      <p>We&apos;ve sent you a confirmation email. Please click the link in the email to confirm your account.</p>
      <p>If you don&apos;t see the email, check your spam folder.</p>

      <RegularButton
        onClick={() => {
          hideAuthModal();
        }}
      >
        Close
      </RegularButton>
    </div>
  );
};
