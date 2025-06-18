import { yupResolver } from '@hookform/resolvers/yup';
import ReCAPTCHA from 'react-google-recaptcha';
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form';
import { FormField } from 'shared/ui/FormField';
import { WhiteButton } from 'shared/ui/WhiteButton';
import { validationSchema } from '../lib/validationSchema';
import cls from './ContactForm.module.scss';

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  recaptcha: string;
}

interface ContactFormProps {
  onSubmit: SubmitHandler<ContactFormData>;
  defaultValues?: ContactFormData | null;
}

export const ContactForm = ({ onSubmit, defaultValues }: ContactFormProps) => {
  const form = useForm<ContactFormData>({
    mode: 'onBlur',
    resolver: yupResolver(validationSchema),
    defaultValues: defaultValues || undefined,
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    trigger,
  } = form;

  const handleCaptchaChange = (value: string | null) => {
    setValue('recaptcha', value || '');
    trigger('recaptcha');
  };

  return (
    <div className={cls.ContactForm}>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField labelText={'Name'} fieldName="name" type="text" error={errors.name?.message} />
          <FormField labelText={'Email'} fieldName="email" type="email" error={errors.email?.message} />
          <FormField labelText={'Message'} fieldName="message" type="textarea" error={errors.message?.message} />
          <div className={cls.recaptcha}>
            <ReCAPTCHA
              sitekey={
                process.env.VITE_ENV === 'development'
                  ? process.env.RE_CAPTCHA_KEY_DEV!
                  : process.env.RE_CAPTCHA_KEY_PROD!
              }
              onChange={handleCaptchaChange}
            />
          </div>
          <FormField fieldName="recaptcha" type="hidden" error={errors.recaptcha?.message} value={''} />

          <WhiteButton type="submit" disabled={!isValid}>
            Send message
          </WhiteButton>
          {/* <div className="disable-button-text">{isValid ? '' : 'all fields are required'}</div> */}
        </form>
      </FormProvider>
    </div>
  );
};
