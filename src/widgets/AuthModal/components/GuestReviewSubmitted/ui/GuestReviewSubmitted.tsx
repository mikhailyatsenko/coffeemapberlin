import { RegularButton } from 'shared/ui/RegularButton';
import cls from './GuestReviewSubmitted.module.scss';

interface GuestReviewSubmittedProps {
  onClose: () => void;
  onSignUp: () => void;
}

export const GuestReviewSubmitted = ({ onClose, onSignUp }: GuestReviewSubmittedProps) => {
  return (
    <div className={cls.GuestReviewSubmitted}>
      <h2>Thanks for your review!</h2>
      <p>
        It&apos;s published anonymously. Create an account and we&apos;ll attach it to you — that&apos;s the only way to
        edit or delete it later ✨
      </p>
      <div className={cls.buttons}>
        <RegularButton onClick={onSignUp}>Create account</RegularButton>
        <RegularButton onClick={onClose} variant="ghost">
          Maybe later
        </RegularButton>
      </div>
    </div>
  );
};
