import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { ContinueWithGoogleButton } from 'entities/AuthForm/components/ContinueWithGoogle';
import { useAuth } from 'shared/api';
import { useAuthHandlers, type SignInWithEmailData } from 'shared/api';
import { FormField } from 'shared/ui/FormField';
import { RegularButton } from 'shared/ui/RegularButton';
import { validationSchemaSignInWithEmail } from '../../../lib/validationSchema';
import cls from './SignInWithEmail.module.scss';

interface SignInWithEmailProps {
  onSwitchToSignUp: () => void;
}

export const SignInWithEmail = ({ onSwitchToSignUp }: SignInWithEmailProps) => {
  const { error } = useAuth();
  const { signInWithEmailHandler } = useAuthHandlers();

  const form = useForm<SignInWithEmailData>({ mode: 'onBlur', resolver: yupResolver(validationSchemaSignInWithEmail) });

  const {
    handleSubmit,

    formState: { errors, isValid },
  } = form;

  return (
    <div className={cls.content}>
      <h2>Sign in</h2>
      <div className={cls.withGoogle}>
        <ContinueWithGoogleButton />
      </div>
      <div className={cls.or}>or</div>

      <FormProvider {...form}>
        <form className={cls.registerWithEmail} onSubmit={handleSubmit(signInWithEmailHandler)}>
          <FormField fieldName="email" type="email" labelText="E-mail" error={errors.email?.message} />
          <FormField fieldName="password" type="password" labelText="Password" error={errors.password?.message} />

          <RegularButton disabled={!isValid}>Sign up</RegularButton>
        </form>
      </FormProvider>
      <p className={cls.errorMessage}>{error?.message}</p>
      <div className={cls.noAccount}>
        No account? <span onClick={onSwitchToSignUp}>Create one</span>
      </div>
    </div>
  );
};
