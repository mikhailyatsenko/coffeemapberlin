import { yupResolver } from '@hookform/resolvers/yup';
import ReCAPTCHA from 'react-google-recaptcha';
import { FormProvider, useForm, type SubmitHandler } from 'react-hook-form';
import { FormField } from 'shared/ui/FormField';
import { RegularButton } from 'shared/ui/RegularButton';
import { validationSchema } from '../lib/validationSchema';
import cls from './ReportInaccuracyForm.module.scss';

export interface ReportInaccuracyFormData {
  placeName: string;
  placeId: string;
  message: string;
  recaptcha: string;
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
      recaptcha: '',
    },
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    trigger,
  } = form;

  const handleCaptchaChange = (value: string | null) => {
    setValue('recaptcha', value || '');
    trigger('recaptcha');
  };

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
          <div className={cls.recaptcha}>
            <ReCAPTCHA
              sitekey={
                process.env.VITE_ENV === 'development'
                  ? process.env.RE_CAPTCHA_KEY_DEV!
                  : process.env.RE_CAPTCHA_KEY_PROD!
              }
              onChange={handleCaptchaChange}
            />
          </div>
          <FormField fieldName="recaptcha" type="hidden" error={errors.recaptcha?.message} value={''} />

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
