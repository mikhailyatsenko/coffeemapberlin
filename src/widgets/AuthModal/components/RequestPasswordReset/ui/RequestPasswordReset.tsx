import { type ApolloError } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as Yup from 'yup';
import { useRequestPasswordResetMutation } from 'shared/generated/graphql';
import { FormField } from 'shared/ui/FormField';
import { RegularButton } from 'shared/ui/RegularButton';
import cls from './RequestPasswordReset.module.scss';

interface RequestPasswordResetProps {
  onSent: () => void;
}

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('E-mail is required'),
});

export const RequestPasswordReset = ({ onSent }: RequestPasswordResetProps) => {
  const onCompleted = useCallback(() => {
    toast.success('If the email exists, we sent reset instructions.', { position: 'top-center' });
    onSent();
  }, [onSent]);

  const onError = useCallback((error: ApolloError) => {
    toast.error(error?.message || 'Failed to request password reset.', { position: 'top-center' });
  }, []);

  const [requestPasswordReset, { loading }] = useRequestPasswordResetMutation({ onCompleted, onError });

  const form = useForm<{ email: string }>({
    defaultValues: { email: '' },
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
  } = form;

  const onSubmit = (data: { email: string }) => {
    if (data.email) {
      requestPasswordReset({ variables: { email: data.email } });
    }
  };

  return (
    <div className={cls.content}>
      <h2>Reset password</h2>
      <p className={cls.hint}>Enter your email to receive a reset link.</p>
      <FormProvider {...form}>
        <form className={cls.form} onSubmit={handleSubmit(onSubmit)}>
          <FormField fieldName="email" type="email" labelText="E-mail" error={errors.email?.message} />
          <RegularButton type="submit" disabled={!isValid || loading}>
            Send reset link
          </RegularButton>
        </form>
      </FormProvider>
    </div>
  );
};
