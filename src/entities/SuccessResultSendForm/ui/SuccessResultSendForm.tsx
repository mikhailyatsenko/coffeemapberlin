import { Link } from 'react-router-dom';
import successIcon from 'shared/assets/successIcon.svg';
import { RegularButton } from 'shared/ui/RegularButton';
import { type SuccessResultSendFormProps } from '../types';
import cls from './SuccessResultSendForm.module.scss';

export const SuccessResultSendForm = ({ name }: SuccessResultSendFormProps) => {
  return (
    <div className={cls.SuccessResultSendForm}>
      <div className={cls.icon}>
        <img src={successIcon} alt="" />
      </div>
      <h3 className={cls.title}>Success!</h3>
      <p className={cls.text}>{name}, your message has been sent! We will review it shortly.</p>
      <Link to={'/'}>
        <RegularButton theme="success">Home</RegularButton>
      </Link>
    </div>
  );
};
