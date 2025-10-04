import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as Yup from 'yup';
import { RoutePaths } from 'shared/constants';
import { useResetPasswordMutation, useValidatePasswordResetTokenMutation } from 'shared/generated/graphql';
import { clearAuth, useAuthStore } from 'shared/stores/auth';
import { FormField } from 'shared/ui/FormField';
import { Loader } from 'shared/ui/Loader';
import { RegularButton } from 'shared/ui/RegularButton';
import cls from './ResetPasswordPage.module.scss';

interface ResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

const validationSchema = Yup.object().shape({
  newPassword: Yup.string().min(8, 'Password must be at least 8 characters').required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm password is required'),
});

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isValidatingToken, setIsValidatingToken] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const onCompleted = useCallback(() => {
    toast.success('Password has been reset. Please sign in.', { position: 'top-center' });
    navigate(`/${RoutePaths.login}`, { replace: true });
  }, [navigate]);

  const onError = useCallback((error: Error) => {
    toast.error(error?.message || 'Failed to reset password.', { position: 'top-center' });
  }, []);

  const onTokenValidationError = useCallback(
    (error: Error) => {
      console.error('Token validation error:', error);
      toast.error('Invalid or expired reset link. Please request a new one.', { position: 'top-center' });
      navigate('/', { replace: true });
    },
    [navigate],
  );

  const onTokenValidationSuccess = useCallback(() => {
    setIsTokenValid(true);
    setIsValidatingToken(false);
  }, []);

  const [validateToken] = useValidatePasswordResetTokenMutation({
    onCompleted: onTokenValidationSuccess,
    onError: onTokenValidationError,
  });

  const [resetPassword, { loading }] = useResetPasswordMutation({ onCompleted, onError });

  const validateTokenAndShowForm = useCallback(() => {
    if (!token || !email || isValidatingToken || isTokenValid) return;

    setIsValidatingToken(true);
    validateToken({ variables: { email, token } });
  }, [token, email, validateToken, isValidatingToken, isTokenValid]);

  const form = useForm<ResetPasswordFormData>({
    resolver: yupResolver(validationSchema),
    mode: 'onChange',
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
  } = form;

  useEffect(() => {
    if (!token || !email) {
      navigate('/', { replace: true });
      return;
    }

    // If user is logged in, logout first for security
    if (user) {
      setIsLoggingOut(true);
      clearAuth().finally(() => {
        setIsLoggingOut(false);
      });
    }
  }, [token, email, navigate, user]);

  // Validate token after logout is complete or if not logged in
  useEffect(() => {
    if (!isLoggingOut && user === null && token && email && !isTokenValid) {
      validateTokenAndShowForm();
    }
  }, [isLoggingOut, user, token, email, isTokenValid, validateTokenAndShowForm]);

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!token || !email) return;
    resetPassword({ variables: { email, token, newPassword: data.newPassword } });
  };

  // Show loading while logging out
  if (isLoggingOut) {
    return (
      <div className={cls.container}>
        <Loader />
        <p>Logging out current session...</p>
      </div>
    );
  }

  // Show loading while validating token
  if (isValidatingToken) {
    return (
      <div className={cls.container}>
        <Loader />
        <p>Validating reset link...</p>
      </div>
    );
  }

  // Show form only if token is valid
  if (isTokenValid) {
    return (
      <div className={cls.container}>
        <h1>Set a new password</h1>
        <FormProvider {...form}>
          <form className={cls.form} onSubmit={handleSubmit(onSubmit)}>
            <FormField
              fieldName="newPassword"
              type="password"
              labelText="New password"
              error={errors.newPassword?.message}
            />
            <FormField
              fieldName="confirmPassword"
              type="password"
              labelText="Confirm password"
              error={errors.confirmPassword?.message}
            />
            <RegularButton type="submit" disabled={!isValid || loading}>
              Reset password
            </RegularButton>
          </form>
        </FormProvider>
      </div>
    );
  }

  // Default loading state
  return (
    <div className={cls.container}>
      <Loader />
    </div>
  );
};
