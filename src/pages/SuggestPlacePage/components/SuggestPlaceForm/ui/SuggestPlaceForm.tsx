import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { FormField } from 'shared/ui/FormField';
import { RegularButton } from 'shared/ui/RegularButton';
import { validationSchema } from '../../../lib/validationSchema';
import { type Suggester, type SuggestPlaceFormValues } from '../../../types';
import { SimilarPlaces } from '../../SimilarPlaces';
import cls from './SuggestPlaceForm.module.scss';

interface SuggestPlaceFormProps {
  /** Guests are offered an email field to hear back; nobody can submit until it's known who is suggesting. */
  suggester: Suggester;
  onSubmit: (values: SuggestPlaceFormValues) => Promise<void>;
  /** Why the last submit failed; the form keeps its values. */
  errorMessage: string | null;
}

export const SuggestPlaceForm = ({ suggester, onSubmit, errorMessage }: SuggestPlaceFormProps) => {
  const form = useForm<SuggestPlaceFormValues>({
    mode: 'onTouched',
    resolver: yupResolver(validationSchema),
    defaultValues: { name: '', address: '', description: '', instagram: '', email: '' },
  });
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;
  const name = useWatch({ control, name: 'name' });

  return (
    <FormProvider {...form}>
      <form className={cls.SuggestPlaceForm} onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField labelText="Name" fieldName="name" type="text" error={errors.name?.message} />
        <SimilarPlaces name={name} />
        <FormField labelText="Address" fieldName="address" type="text" error={errors.address?.message} />
        <FormField
          labelText="What makes it good? (optional)"
          fieldName="description"
          type="textarea"
          error={errors.description?.message}
        />
        <FormField
          labelText="Instagram (optional)"
          fieldName="instagram"
          type="text"
          error={errors.instagram?.message}
        />
        {suggester === 'guest' && (
          <div className={cls.email}>
            <FormField
              labelText="Email (optional)"
              fieldName="email"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
            />
            <p className={cls.caption}>Only to tell you when it&apos;s added</p>
          </div>
        )}
        {errorMessage && (
          <p className={cls.submitError} role="alert">
            {errorMessage}
          </p>
        )}
        <RegularButton
          className={cls.submitButton}
          size="lg"
          type="submit"
          loading={isSubmitting || suggester === 'unknown'}
        >
          Suggest this Place
        </RegularButton>
      </form>
    </FormProvider>
  );
};
