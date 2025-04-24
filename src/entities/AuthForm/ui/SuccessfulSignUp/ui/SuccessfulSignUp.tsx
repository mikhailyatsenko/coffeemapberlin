import { useAuth } from 'shared/api';

import { RegularButton } from 'shared/ui/RegularButton';
import cls from './SuccessfulSignUp.module.scss';

export const SuccessfulSignUp = () => {
  const { user, setAuthModalContentVariant } = useAuth();

  return (
    <div className={cls.content}>
      <h2>Hi, {user?.displayName}!</h2>
      <h3>Thanks for joining our community!{'\u00A0'}🎉</h3>

      <p>You can now leave reviews and ratings, as well as keep track of your personal list of favorites.</p>
      <p>Enjoy exploring and sharing your experiences!</p>

      <RegularButton
        onClick={() => {
          setAuthModalContentVariant(null);
        }}
      >
        Here we go!
      </RegularButton>
    </div>
  );
};
