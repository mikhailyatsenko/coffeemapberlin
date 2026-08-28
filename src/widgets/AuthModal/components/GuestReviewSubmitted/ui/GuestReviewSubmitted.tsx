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
        It&apos;s live and everyone can see it — just anonymously. Only this browser knows the review is yours: clear
        its data or open the site elsewhere and the review stays up, but you&apos;ll lose the ability to edit it or put
        your name on it. Create an account and it&apos;s yours for good ✨
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
