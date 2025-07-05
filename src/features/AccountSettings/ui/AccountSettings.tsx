import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  type SetNewPasswordFormData,
  type PersonalDataFormData,
  PersonalSettingsForm,
  PasswordSettingsForm,
} from 'entities/AccountSettingsForm';
import { useSetNewPasswordMutation, useUpdatePersonalDataMutation } from 'shared/generated/graphql';
import { checkAuth, useAuthStore } from 'shared/stores/auth';
import { Loader } from 'shared/ui/Loader';
import { passwordValidationSchema, personalDataValidationSchema } from '../lib/validationSchema';
import cls from './AccountSettings.module.scss';

export const AccountSettings = () => {
  const { user } = useAuthStore();

  const passwordForm = useForm<SetNewPasswordFormData>({
    mode: 'onBlur',
    resolver: yupResolver(passwordValidationSchema),
    context: { isGoogleUserUserWithoutPassword: user?.isGoogleUserUserWithoutPassword },
  });

  const personalDataForm = useForm<PersonalDataFormData>({
    mode: 'onBlur',
    resolver: yupResolver(personalDataValidationSchema),
    defaultValues: {
      displayName: user?.displayName || '',
      email: user?.email || '',
    },
  });

  const { reset: resetPasswordValues } = passwordForm;

  const { reset: resetPersonalData, watch: watchPersonalData } = personalDataForm;

  const [setNewPassword, { loading: loadingPassword, error: errorSettingPassword }] = useSetNewPasswordMutation();
  const [updatePersonalData, { loading: loadingPersonalData, error: errorUpdatingPersonalData }] =
    useUpdatePersonalDataMutation();

  useEffect(() => {
    if (user) {
      resetPersonalData({
        displayName: user.displayName,
        email: user.email,
      });
    }
  }, [user, resetPersonalData]);

  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }

  const isDisplayNameChanged = watchPersonalData('displayName').trim() !== user?.displayName;

  const isEmailChanged = watchPersonalData('email').trim() !== user?.email;

  const isButtonPersonalFormDisabled = !isDisplayNameChanged && !isEmailChanged;

  const onUpdatePersonalDataSubmit: SubmitHandler<PersonalDataFormData> = async (data) => {
    try {
      const response = await updatePersonalData({
        variables: {
          userId: user.id,
          displayName: data.displayName.trim(),
          email: data.email.trim(),
        },
      });
      if (response) {
        await checkAuth();
        toast.success('Profile updated successfully');
      }
    } catch (err) {
      const errorMessage = (err as Error).message || 'Unknown error';

      console.error('Registration error:', errorMessage);
    }
  };

  const onSetNewPasswordSubmit: SubmitHandler<SetNewPasswordFormData> = async (data) => {
    try {
      const response = await setNewPassword({
        variables: {
          userId: user.id,
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        },
      });
      if (response) {
        resetPasswordValues();
        await checkAuth();
        toast.success('Password updated successfully');
      }
    } catch (err) {
      const errorMessage = (err as Error).message || 'Unknown error';

      console.error('Registration error:', errorMessage);
    }
  };

  return (
    <div className={cls.settingsSection}>
      {loadingPassword || loadingPersonalData ? <Loader /> : null}
      <PersonalSettingsForm
        isButtonPersonalFormDisabled={isButtonPersonalFormDisabled}
        onUpdatePersonalDataSubmit={onUpdatePersonalDataSubmit}
        personalDataForm={personalDataForm}
        errorUpdatingPersonalData={errorUpdatingPersonalData}
      />
      <PasswordSettingsForm
        isGoogleUserUserWithoutPassword={user.isGoogleUserUserWithoutPassword}
        onSetNewPasswordSubmit={onSetNewPasswordSubmit}
        passwordForm={passwordForm}
        userEmail={user.email}
        errorSettingPassword={errorSettingPassword}
      />
    </div>
  );
};
