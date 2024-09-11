import { useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'shared/lib/reactContext/Auth/useAuth';
import { REGISTER_USER } from 'shared/query/apolloQuries';
import { RegularButton } from 'shared/ui/RegularButton';
import { FormField } from '../../FormField';
import { GoogleLoginButton } from '../../GoogleLoginButton';

import { validationSchema } from '../lib/validationSchema';
import cls from './RegisterWithEmail.module.scss';

interface RegisterWithEmailData {
  displayName: string;
  email: string;
  password: string;
  repeatPassword: string;
  recaptcha: string;
}

export const RegisterWithEmail: React.FC = () => {
  const navigate = useNavigate();

  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [
    registerUser,
    {
      // loading,
      error,
    },
  ] = useMutation(REGISTER_USER);
  const { checkAuth, setIsLoginPopup } = useAuth();
  const form = useForm<RegisterWithEmailData>({ mode: 'onBlur', resolver: yupResolver(validationSchema) });

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

  const onSubmit: SubmitHandler<RegisterWithEmailData> = async (data) => {
    try {
      const response = await registerUser({
        variables: {
          email: data.email,
          displayName: data.displayName,
          password: data.password,
        },
      });
      if (response) {
        checkAuth();
        setIsLoginPopup(false);
        navigate('/');
      }
    } catch (err) {
      const errorMessage = (err as Error).message || 'Unknown error';
      setRegistrationError(`Registration error: ${errorMessage}`);
      console.error('Registration error:', errorMessage);
    }
  };

  return (
    <div className={cls.content}>
      <h1>Create account</h1>
      <div className={cls.withGoogle}>
        <GoogleLoginButton textButton="Continue with Google" />
      </div>
      <div className={cls.or}>or</div>

      <FormProvider {...form}>
        <form className={cls.registerWithEmail} onSubmit={handleSubmit(onSubmit)}>
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
    </div>
  );
};
