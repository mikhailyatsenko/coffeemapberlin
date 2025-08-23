import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { FormProvider, useForm } from 'react-hook-form';
import { useRegisterUserMutation } from 'shared/generated/graphql';
import { FormField } from 'shared/ui/FormField';
import { Loader } from 'shared/ui/Loader';
import { RegularButton } from 'shared/ui/RegularButton';
import { validationSchemaSignUpWithEmail } from '../lib/validationSchema';
import { type SignUpWithEmailData, type SignUpWithEmailProps } from '../types';
import cls from './SignUpWithEmail.module.scss';

export const SignUpWithEmail = ({
  onFormSent,
  onSwitchToSignIn,
  continueWithSocial,
  setError,
}: SignUpWithEmailProps) => {
  const form = useForm({ mode: 'onChange', resolver: yupResolver(validationSchemaSignUpWithEmail) });
  const [isLoading, setIsLoading] = useState(false);
  const {
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = form;

  const [registerUser] = useRegisterUserMutation();

  const signUpWithEmailHandler = async (data: SignUpWithEmailData) => {
    try {
      setIsLoading(true);
      await registerUser({
        variables: {
          email: data.email,
          displayName: data.displayName,
          password: data.password,
        },
      });
      onFormSent();
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err instanceof Error ? err : new Error('An unknown error occurred during sign up'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCaptchaChange = (value: string | null) => {
    setValue('recaptcha', value || '');
    trigger('recaptcha');
  };

  return (
    <div className={cls.content}>
      {isLoading ? <Loader /> : null}
      <h2>Create account</h2>
      <div className={cls.continueWithSocial}>{continueWithSocial?.map((social) => social)}</div>
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
            {errors.recaptcha && <p>{errors.recaptcha.message}</p>}
          </div>
          {/* <FormField fieldName="recaptcha" type="hidden" error={errors.recaptcha?.message} value={''} /> */}
          <RegularButton type="submit" disabled={!isValid || isLoading}>
            Sign up
          </RegularButton>
        </form>
      </FormProvider>
      <div className={cls.signIn}>
        Have an account?{' '}
        <span
          onClick={() => {
            onSwitchToSignIn();
          }}
        >
          Sign in
        </span>
      </div>
    </div>
  );
};
