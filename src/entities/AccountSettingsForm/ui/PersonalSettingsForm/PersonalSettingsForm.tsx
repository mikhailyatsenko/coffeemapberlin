import { type ApolloError } from '@apollo/client';
import { useEffect, useState } from 'react';
import { FormProvider, type SubmitHandler, type UseFormReturn } from 'react-hook-form';
import { type PersonalDataFormData } from 'entities/AccountSettingsForm/model/types/accountSettings';
import { FormField } from 'shared/ui/FormField';
import { RegularButton } from 'shared/ui/RegularButton';
import cls from '../AccountSettingsForm.module.scss';

interface PersonalSettingsFormProps {
  personalDataForm: UseFormReturn<PersonalDataFormData, unknown, PersonalDataFormData>;
  onUpdatePersonalDataSubmit: SubmitHandler<PersonalDataFormData>;
  errorUpdatingPersonalData?: ApolloError;
  initialDisplayName: string;
  initialEmail: string;
}

export const PersonalSettingsForm = ({
  onUpdatePersonalDataSubmit,
  personalDataForm,
  errorUpdatingPersonalData,
  initialDisplayName,
  initialEmail,
}: PersonalSettingsFormProps) => {
  const {
    handleSubmit: handlePersonalDataSubmit,
    formState: { errors: personalDataErrors, isValid: isPersonalDataValid },
  } = personalDataForm;

  const [displayNameValue, setDisplayNameValue] = useState(initialDisplayName);
  const [emailValue, setEmailValue] = useState(initialEmail);

  useEffect(() => {
    setDisplayNameValue(initialDisplayName);
    setEmailValue(initialEmail);
  }, [initialDisplayName, initialEmail]);

  const isChanged = displayNameValue.trim() !== initialDisplayName.trim() || emailValue.trim() !== initialEmail.trim();

  return (
    <div className={cls.settingsCard}>
      <h2 className={cls.settingsTitle}>Personal data</h2>
      <FormProvider {...personalDataForm}>
        <form className={cls.userForm} onSubmit={handlePersonalDataSubmit(onUpdatePersonalDataSubmit)}>
          <FormField
            fieldName="displayName"
            type="text"
            labelText="Name"
            error={personalDataErrors.displayName?.message}
            onValueChange={setDisplayNameValue}
          />
          <FormField
            fieldName="email"
            type="email"
            labelText="E-mail"
            error={personalDataErrors.email?.message}
            onValueChange={setEmailValue}
          />

          <RegularButton type="submit" className={cls.submitButton} disabled={!isPersonalDataValid || !isChanged}>
            Save changes
          </RegularButton>
        </form>
      </FormProvider>
      <p className={cls.errorMessage}>{errorUpdatingPersonalData?.message}</p>
    </div>
  );
};
