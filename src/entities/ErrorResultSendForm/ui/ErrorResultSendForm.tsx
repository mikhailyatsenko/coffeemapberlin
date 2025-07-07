import errorIcon from 'shared/assets/errorIcon.svg';
import { RegularButton } from 'shared/ui/RegularButton';
import { type ErrorResultSendFormProps } from '../types';
import cls from './ErrorResultSendForm.module.scss';

export const ErrorResultSendForm = ({ handleTryAgain }: ErrorResultSendFormProps) => {
  return (
    <div className={cls.ErrorResultSendForm}>
      <div className={cls.icon}>
        <img src={errorIcon} alt="" />
      </div>
      <h3 className={cls.title}>Oops!</h3>
      <p className={cls.text}>Something went wrong while sending your message. Please try again later.</p>
      <RegularButton onClick={handleTryAgain} theme="error">
        Try again
      </RegularButton>
    </div>
  );
};
