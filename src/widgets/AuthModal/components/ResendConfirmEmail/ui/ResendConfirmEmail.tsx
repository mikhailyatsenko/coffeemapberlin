import { type ApolloError } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import { useResendConfirmationEmailMutation } from 'shared/generated/graphql';
import { FormField } from 'shared/ui/FormField';
import { RegularButton } from 'shared/ui/RegularButton';
import Toast from 'shared/ui/ToastMessage/Toast';
import { confirmEmailValidationSchema } from '../lib/validationSchema';
import { type ResendConfirmEmailProps } from '../types';
import cls from './ResendConfirmEmail.module.scss';

export const ResendConfirmEmail = ({ isExpired }: ResendConfirmEmailProps) => {
  const location = useLocation();
  const { email } = (location.state || {}) as { email?: string };

  const [toastMessage, setToastMessage] = useState('');

  const onCompleted = useCallback(() => {
    setToastMessage('Confirmation email sent successfully!');
  }, []);

  const onError = useCallback((error: ApolloError) => {
    // TODO: use toast library in all project instead my custom Toast
    setToastMessage(error?.message || 'Failed to resend confirmation email.');
  }, []);

  const [resendConfirmationEmailMutation, { loading }] = useResendConfirmationEmailMutation({
    onCompleted,
    onError,
  });

  const form = useForm<{ email: string }>({
    defaultValues: { email },
    resolver: yupResolver(confirmEmailValidationSchema),
    mode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (email) {
      form.reset({ email });
    }
  }, [email, form]);

  const onSubmit = (data: { email: string }) => {
    if (data.email) {
      resendConfirmationEmailMutation({ variables: { email: data.email } });
    }
  };

  return (
    <div className={cls.content}>
      <h3>{isExpired ? 'The link has expired' : 'The link is invalid'}</h3>

      <p>Please enter your email to resend the confirmation email.</p>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField fieldName="email" type="email" error={errors.email?.message} />
          <RegularButton disabled={!form.formState.isValid || loading} type="submit">
            Resend
          </RegularButton>
        </form>
      </FormProvider>
      <Toast message={toastMessage} />
    </div>
  );
};
