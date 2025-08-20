import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { client } from 'shared/config/apolloClient';
import { useSignInWithEmailMutation } from 'shared/generated/graphql';
import { checkAuth } from 'shared/stores/auth';
import { FormField } from 'shared/ui/FormField';
import { Loader } from 'shared/ui/Loader';
import { RegularButton } from 'shared/ui/RegularButton';
import { validationSchemaSignInWithEmail } from '../lib/validationSchema';
import { type SignInWithEmailData, type SignInWithEmailProps } from '../types';
import cls from './SignInWithEmail.module.scss';

export const SignInWithEmail = ({
  hideAuthModal,
  onSwitchToSignUp,
  continueWithSocial,
  setError,
}: SignInWithEmailProps) => {
  const [signInWithEmail] = useSignInWithEmailMutation();
  const [isLoading, setIsLoading] = useState(false);

  const signInWithEmailHandler = async (data: SignInWithEmailData) => {
    try {
      setIsLoading(true);
      const response = await signInWithEmail({
        variables: {
          email: data.email,
          password: data.password,
        },
      });
      if (response) {
        await checkAuth();
        if (hideAuthModal) {
          hideAuthModal();
        }
        setIsLoading(false);
        await client.resetStore();
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred during sign in'));
    } finally {
      setIsLoading(false);
    }
  };

  const form = useForm<SignInWithEmailData>({ mode: 'onBlur', resolver: yupResolver(validationSchemaSignInWithEmail) });

  const {
    handleSubmit,
    formState: { errors, isValid },
  } = form;

  return (
    <div className={cls.content}>
      {isLoading ? <Loader /> : null}
      <h2>Sign in</h2>
      <div className={cls.continueWithSocial}>{continueWithSocial?.map((social) => social)}</div>
      <div className={cls.or}>or</div>

      <FormProvider {...form}>
        <form className={cls.registerWithEmail} onSubmit={handleSubmit(signInWithEmailHandler)}>
          <FormField fieldName="email" type="email" labelText="E-mail" error={errors.email?.message} />
          <FormField fieldName="password" type="password" labelText="Password" error={errors.password?.message} />

          <RegularButton type="submit" disabled={!isValid || isLoading}>
            Sign in
          </RegularButton>
        </form>
      </FormProvider>
      <div className={cls.noAccount}>
        No account?{' '}
        <span
          onClick={() => {
            onSwitchToSignUp();
          }}
        >
          Create one
        </span>
      </div>
    </div>
  );
};
