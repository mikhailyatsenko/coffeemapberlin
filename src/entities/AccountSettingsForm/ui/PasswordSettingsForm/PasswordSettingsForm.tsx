import { type ApolloError } from '@apollo/client';
import { FormProvider, type SubmitHandler, type UseFormReturn } from 'react-hook-form';
import { type SetNewPasswordFormData } from 'entities/AccountSettingsForm/model/types/accountSettings';
import { FormField } from 'shared/ui/FormField';
import { RegularButton } from 'shared/ui/RegularButton';
import cls from '../AccountSettingsForm.module.scss';

interface PasswordSettingsFormProps {
  passwordForm: UseFormReturn<SetNewPasswordFormData, unknown, SetNewPasswordFormData>;
  onSetNewPasswordSubmit: SubmitHandler<SetNewPasswordFormData>;
  errorSettingPassword?: ApolloError;
  userEmail: string;
  isGoogleUserUserWithoutPassword: boolean;
}

export const PasswordSettingsForm = ({
  onSetNewPasswordSubmit,
  passwordForm,
  userEmail,
  isGoogleUserUserWithoutPassword,
  errorSettingPassword,
}: PasswordSettingsFormProps) => {
  const {
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isValid: isPasswordValid },
  } = passwordForm;
  return (
    <div className={cls.settingsCard}>
      <h2 className={cls.settingsTitle}>Password</h2>
      <FormProvider {...passwordForm}>
        <form className={cls.userForm} onSubmit={handlePasswordSubmit(onSetNewPasswordSubmit)}>
          <input
            type="email"
            name="email"
            value={userEmail}
            autoComplete="email"
            style={{ display: 'none' }}
            readOnly
          />
          {!isGoogleUserUserWithoutPassword && (
            <FormField
              fieldName="oldPassword"
              type="password"
              labelText="Old Password"
              error={passwordErrors.oldPassword?.message}
              autoComplete="current-password"
            />
          )}
          <FormField
            fieldName="newPassword"
            type="password"
            labelText="New password"
            autoComplete="new-password"
            error={passwordErrors.newPassword?.message}
          />
          <FormField
            fieldName="repeatPassword"
            type="password"
            labelText="Repeat password"
            autoComplete="new-password"
            error={passwordErrors.repeatPassword?.message}
          />

          <RegularButton className={cls.submitButton} type="submit" disabled={!isPasswordValid}>
            Save changes
          </RegularButton>
        </form>

        {isGoogleUserUserWithoutPassword && (
          <div className={cls.noPasswordInfo}>
            You&apos;re logged in with Google and don&apos;t have a password yet. Set one here to enable logging in with
            your email and password.
          </div>
        )}
      </FormProvider>
      <p className={cls.errorMessage}>{errorSettingPassword?.message}</p>
    </div>
  );
};
