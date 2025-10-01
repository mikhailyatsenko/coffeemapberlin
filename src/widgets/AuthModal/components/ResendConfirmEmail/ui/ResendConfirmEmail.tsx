import { type ApolloError } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { useResendConfirmationEmailMutation } from 'shared/generated/graphql';
import { hideModal } from 'shared/stores/modal';
import { FormField } from 'shared/ui/FormField';
import { RegularButton } from 'shared/ui/RegularButton';
import { confirmEmailValidationSchema } from '../lib/validationSchema';
import { type ResendConfirmEmailProps } from '../types';
import cls from './ResendConfirmEmail.module.scss';

export const ResendConfirmEmail = ({ isExpired }: ResendConfirmEmailProps) => {
  const location = useLocation();
  const { email } = (location.state ?? {}) as {
    token?: string;
    email?: string;
  };

  const onCompleted = useCallback(() => {
    toast.success('Confirmation email sent successfully!', { position: 'top-center' });
    hideModal();
  }, []);

  const onError = useCallback((error: ApolloError) => {
    toast.error(error?.message || 'Failed to resend confirmation email.', { position: 'top-center' });
  }, []);

  const [resendConfirmationEmailMutation, { loading }] = useResendConfirmationEmailMutation({
    onCompleted,
    onError,
  });

  const form = useForm<{ email: string }>({
    defaultValues: { email: email || '' },
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

      <p>Resend the confirmation email{`${isExpired ? ` on ${email}` : ``}?`}</p>
      <FormProvider {...form}>
        <form className={cls.form} onSubmit={handleSubmit(onSubmit)}>
          <FormField
            type={isExpired ? 'hidden' : 'email'}
            className={cls.emailField}
            fieldName="email"
            error={errors.email?.message}
          />
          <RegularButton disabled={!form.formState.isValid || loading} type="submit">
            Resend
          </RegularButton>
        </form>
      </FormProvider>
    </div>
  );
};
