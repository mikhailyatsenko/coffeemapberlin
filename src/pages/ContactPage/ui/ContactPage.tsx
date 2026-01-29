import { Helmet } from 'react-helmet';
import { SendContactForm } from 'features/SendContactForm/';
import cls from './ContactPage.module.scss';

const ContactPage = () => {
  return (
    <div className={cls.ContactPage}>
      <Helmet>
        <title>Contact | Berlin Coffee Map</title>
      </Helmet>
      <div className={cls.textContainer}>
        <div className={cls.contactInfo}>
          <h1>Let&apos;s get in touch!</h1>
          <p className={cls.decription}>We&apos;re open for any suggestion or just to have a chat</p>
        </div>
      </div>
      <div className={cls.formContainer}>
        <SendContactForm />
      </div>
    </div>
  );
};

export default ContactPage;
