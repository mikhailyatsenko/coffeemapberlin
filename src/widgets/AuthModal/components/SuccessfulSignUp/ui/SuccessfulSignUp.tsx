import { useAuthStore } from 'shared/stores/auth';

import { RegularButton } from 'shared/ui/RegularButton';
import cls from './SuccessfulSignUp.module.scss';

interface SuccessfulSignUpProps {
  hideAuthModal: () => void;
}

export const SuccessfulSignUp = ({ hideAuthModal }: SuccessfulSignUpProps) => {
  const { user } = useAuthStore();

  return (
    <div className={cls.content}>
      <h2>Hi, {user?.displayName}!</h2>
      <h3>Thanks for joining our community!{'\u00A0'}🎉</h3>

      <p>You can now leave reviews and ratings, as well as keep track of your personal list of favorites.</p>
      <p>Enjoy exploring and sharing your experiences!</p>

      <RegularButton
        onClick={() => {
          hideAuthModal();
        }}
      >
        Here we go!
      </RegularButton>
    </div>
  );
};
