import { type ApolloError } from '@apollo/client';
import { FormProvider, type SubmitHandler, type UseFormReturn } from 'react-hook-form';
import { type PersonalDataFormData } from 'entities/AccountSettingsForm/model/types/accountSettings';
import { FormField } from 'shared/ui/FormField';
import { RegularButton } from 'shared/ui/RegularButton';
import cls from '../AccountSettingsForm.module.scss';

interface PersonalSettingsFormProps {
  personalDataForm: UseFormReturn<PersonalDataFormData, unknown, PersonalDataFormData>;
  onUpdatePersonalDataSubmit: SubmitHandler<PersonalDataFormData>;
  isButtonPersonalFormDisabled: boolean;
  errorUpdatingPersonalData?: ApolloError;
}

export const PersonalSettingsForm = ({
  isButtonPersonalFormDisabled,
  onUpdatePersonalDataSubmit,
  personalDataForm,
  errorUpdatingPersonalData,
}: PersonalSettingsFormProps) => {
  const {
    handleSubmit: handlePersonalDataSubmit,
    formState: { errors: personalDataErrors, isValid: isPersonalDataValid },
  } = personalDataForm;
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
          />
          <FormField fieldName="email" type="email" labelText="E-mail" error={personalDataErrors.email?.message} />

          <RegularButton className={cls.submitButton} disabled={!isPersonalDataValid || isButtonPersonalFormDisabled}>
            Save changes
          </RegularButton>
        </form>
      </FormProvider>
      <p className={cls.errorMessage}>{errorUpdatingPersonalData?.message}</p>
    </div>
  );
};
