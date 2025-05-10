import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { useAuth } from 'shared/api';
import { client } from 'shared/config/apolloClient';
import { useSignInWithEmailMutation } from 'shared/generated/graphql';
import { FormField } from 'shared/ui/FormField';
import { RegularButton } from 'shared/ui/RegularButton';
import { validationSchemaSignInWithEmail } from '../lib/validationSchema';
import { type SignInWithEmailData, type SignInWithEmailProps } from '../types';
import cls from './SignInWithEmail.module.scss';

export const SignInWithEmail = ({ hideAuthModal, onSwitchToSignUp, continueWithSocial }: SignInWithEmailProps) => {
  const { setIsLoading, setError, checkAuth, error: authError } = useAuth();

  const [signInWithEmail] = useSignInWithEmailMutation();

  const signInWithEmailHandler = async (data: SignInWithEmailData) => {
    setIsLoading(true);
    try {
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
      setIsLoading(false);
      setError(err instanceof Error ? err : new Error('An unknown error occurred during sign in'));
    }
  };

  const form = useForm<SignInWithEmailData>({ mode: 'onBlur', resolver: yupResolver(validationSchemaSignInWithEmail) });

  const {
    handleSubmit,
    formState: { errors, isValid },
  } = form;

  return (
    <div className={cls.content}>
      <h2>Sign in</h2>
      <div className={cls.continueWithSocial}>{continueWithSocial?.map((social) => social)}</div>
      <div className={cls.or}>or</div>

      <FormProvider {...form}>
        <form className={cls.registerWithEmail} onSubmit={handleSubmit(signInWithEmailHandler)}>
          <FormField fieldName="email" type="email" labelText="E-mail" error={errors.email?.message} />
          <FormField fieldName="password" type="password" labelText="Password" error={errors.password?.message} />

          <RegularButton disabled={!isValid}>Sign up</RegularButton>
        </form>
      </FormProvider>
      <p className={cls.errorMessage}>{authError?.message}</p>
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
