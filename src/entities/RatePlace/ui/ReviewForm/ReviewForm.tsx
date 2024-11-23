import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { FormProvider, type SubmitHandler, useForm } from 'react-hook-form';
import { FormField } from 'shared/ui/FormField';
import { RegularButton } from 'shared/ui/RegularButton';
import { validationSchema } from '../../lib/validationSchema';
import cls from './ReviewForm.module.scss';

interface ReviewFormProps {
  onSubmit: (text: string) => void;
  onClose: () => void;
  initialValue?: string;
}

interface ReviewFormData {
  review: string;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, onClose, initialValue = '' }) => {
  const form = useForm<ReviewFormData>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: { review: initialValue },
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
  } = form;

  const handleFormSubmit: SubmitHandler<ReviewFormData> = (data) => {
    if (data.review.trim()) {
      onSubmit(data.review);
    }
  };

  return (
    <FormProvider {...form}>
      <form className={`${cls.reviewForm}`} onSubmit={handleSubmit(handleFormSubmit)}>
        <FormField fieldName="review" type="textarea" labelText="Review" autoFocus={true} />
        {errors.review && <p className={cls.formError}>{errors.review.message}</p>}
        <div className={cls.buttons}>
          <RegularButton theme="blank" type="button" onClick={onClose}>
            &#8612; Back
          </RegularButton>
          <RegularButton type="submit" disabled={!isValid}>
            Submit Review
          </RegularButton>
        </div>
      </form>
    </FormProvider>
  );
};
