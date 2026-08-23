import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form';
import { FormField } from 'shared/ui/FormField';
import { RegularButton } from 'shared/ui/RegularButton';
import { validationSchema } from '../lib/validationSchema';
import cls from './ReportInaccuracyForm.module.scss';

export interface ReportInaccuracyFormData {
  placeName: string;
  placeId: string;
  message: string;
}

interface ReportInaccuracyFormProps {
  onSubmit: SubmitHandler<ReportInaccuracyFormData>;
  defaultValues?: ReportInaccuracyFormData | null;
}

export const ReportInaccuracyForm = ({ onSubmit, defaultValues }: ReportInaccuracyFormProps) => {
  const form = useForm<ReportInaccuracyFormData>({
    mode: 'onChange',
    resolver: yupResolver<ReportInaccuracyFormData>(validationSchema),
    defaultValues: defaultValues || {
      placeName: '',
      placeId: '',
      message: '',
    },
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
  } = form;

  return (
    <div className={cls.ReportInaccuracyForm}>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField
            labelText={'Place name'}
            fieldName="placeName"
            type="text"
            error={errors.placeName?.message}
            disabled={true}
          />
          <FormField
            fieldName="placeId"
            type="hidden"
            error={errors.placeId?.message}
            value={defaultValues?.placeId || ''}
          />
          <FormField
            autoFocus={true}
            labelText={"What's wrong?"}
            fieldName="message"
            type="textarea"
            error={errors.message?.message}
          />

          <RegularButton
            className={cls.submitButton}
            size="lg"
            theme="primary"
            variant="outline"
            type="submit"
            disabled={!isValid}
          >
            Send report
          </RegularButton>
        </form>
      </FormProvider>
    </div>
  );
};
