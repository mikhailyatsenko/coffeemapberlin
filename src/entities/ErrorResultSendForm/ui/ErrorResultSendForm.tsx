import { RegularButton } from 'shared/ui/RegularButton';
import errorIcon from '../../../shared/assets/errorIcon.svg';
import cls from './ErrorResultSendForm.module.scss';

export const ErrorResultSendForm = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className={cls.ErrorResultSendForm}>
      <div className={cls.icon}>
        <img src={errorIcon} alt="" />
      </div>
      <h3 className={cls.title}>Oops!</h3>
      <p className={cls.text}>Something went wrong while sending your message. Please try again later.</p>
      <RegularButton onClick={handleRefresh} theme="error">
        Try again
      </RegularButton>
    </div>
  );
};
