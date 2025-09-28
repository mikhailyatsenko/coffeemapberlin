import { RegularButton } from 'shared/ui/RegularButton';
import cls from './GuestFavoritesInfo.module.scss';

interface GuestFavoritesInfoProps {
  onClose: () => void;
  onSignIn: () => void;
}

export const GuestFavoritesInfo = ({ onClose, onSignIn }: GuestFavoritesInfoProps) => {
  return (
    <div className={cls.GuestFavoritesInfo}>
      <h2>You&apos;re browsing as a guest</h2>
      <p>
        We&apos;ll keep your favorite places only on this device. Want your list on any device? Sign in or create an
        account ✨
      </p>
      <div className={cls.buttons}>
        <RegularButton onClick={onSignIn}>Sign in</RegularButton>
        <RegularButton onClick={onClose} variant="ghost">
          Continue as guest
        </RegularButton>
      </div>
    </div>
  );
};
