import { yupResolver } from '@hookform/resolvers/yup';
import ReCAPTCHA from 'react-google-recaptcha';
import { FormProvider, useForm } from 'react-hook-form';
import { ContinueWithGoogleButton } from 'entities/AuthForm/components/ContinueWithGoogle';
import { validationSchemaSignUpWithEmail } from 'entities/AuthForm/lib/validationSchema';
import { useAuthHandlers, type SignUpWithEmailData } from 'shared/api';
import { useAuth } from 'shared/api';
import { FormField } from 'shared/ui/FormField';
import { RegularButton } from 'shared/ui/RegularButton';
import cls from './SignUpWithEmail.module.scss';

interface SignUpWithEmailProps {
  onSwitchToSignIn: () => void;
}

export const SignUpWithEmail = ({ onSwitchToSignIn }: SignUpWithEmailProps) => {
  const { error } = useAuth();

  const { signUpWithEmailHandler } = useAuthHandlers();
  const form = useForm<SignUpWithEmailData>({ mode: 'onBlur', resolver: yupResolver(validationSchemaSignUpWithEmail) });

  const {
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = form;

  const handleCaptchaChange = (value: string | null) => {
    setValue('recaptcha', value || '');
    trigger('recaptcha');
  };

  return (
    <div className={cls.content}>
      <h2>Create account</h2>
      <div className={cls.withGoogle}>
        <ContinueWithGoogleButton />
      </div>
      <div className={cls.or}>or</div>

      <FormProvider {...form}>
        <form className={cls.registerWithEmail} onSubmit={handleSubmit(signUpWithEmailHandler)}>
          <FormField fieldName="displayName" type="text" labelText="Name" error={errors.displayName?.message} />
          <FormField fieldName="email" type="email" labelText="E-mail" error={errors.email?.message} />
          <FormField fieldName="password" type="password" labelText="Password" error={errors.password?.message} />
          <FormField
            fieldName="repeatPassword"
            type="password"
            labelText="Repeat password"
            error={errors?.repeatPassword?.message}
          />
          <div className={cls.recaptcha}>
            <ReCAPTCHA
              sitekey={
                process.env.VITE_ENV === 'development'
                  ? process.env.RE_CAPTCHA_KEY_DEV!
                  : process.env.RE_CAPTCHA_KEY_PROD!
              }
              onChange={handleCaptchaChange}
            />
            {errors.recaptcha && <p>Please complete the reCAPTCHA</p>}
          </div>
          <FormField fieldName="recaptcha" type="hidden" error={errors.recaptcha?.message} value={''} />
          <RegularButton disabled={!isValid}>Sign up</RegularButton>
        </form>
      </FormProvider>
      {error?.message}
      <div className={cls.signIn}>
        Have an account? <span onClick={onSwitchToSignIn}>Sign in</span>
      </div>
    </div>
  );
};
