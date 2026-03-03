import type { ChangeEvent } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import cls from './FormField.module.scss';

interface FormFieldProps {
  fieldName: string;
  type?: string;
  error?: string | undefined;
  value?: string;
  labelText?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  className?: string;
  disabled?: boolean;
  onValueChange?: (value: string) => void;
}
export const FormField: React.FC<FormFieldProps> = ({
  fieldName,
  type,
  error,
  labelText,
  autoComplete,
  autoFocus,
  disabled,
  onValueChange,
}) => {
  const { control } = useFormContext();

  return (
    <div className={`${cls.formGroup} ${type === 'hidden' ? cls.hiddenGroup : ''}`}>
      <Controller
        name={fieldName}
        control={control}
        render={({ field }) => {
          const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            field.onChange(event);
            onValueChange?.(event.target.value);
          };

          const parameters = {
            ...field,
            placeholder: fieldName,
            type,
            autoComplete,
            autoFocus,
            disabled,
            id: fieldName,
            onChange: handleChange,
          };

          return !(type === 'textarea') ? (
            <input className={`${cls.formField} ${error ? cls.error : ''}`} {...parameters} />
          ) : (
            <textarea className={`${cls.formField} ${error ? cls.error : ''}`} rows={4} {...parameters} />
          );
        }}
      />

      <label className={cls.formLabel} htmlFor={fieldName}>
        {labelText}
      </label>

      <div className={cls.errorContainer}>{error && <p className={cls.errorMessage}>{error}</p>}</div>
    </div>
  );
};
