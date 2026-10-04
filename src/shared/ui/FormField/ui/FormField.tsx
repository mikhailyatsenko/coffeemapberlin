import type { ChangeEvent } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import cls from './FormField.module.scss';

interface FormFieldProps {
  fieldName: string;
  type?: string;
  error?: string | undefined;
  hint?: string;
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
  hint,
  labelText,
  autoComplete,
  autoFocus,
  disabled,
  onValueChange,
}) => {
  const { control } = useFormContext();
  // An active error takes the hint's place, so the field only ever describes itself by one message.
  const message = error ?? hint;
  const messageId = `${fieldName}-message`;

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
            'aria-describedby': message ? messageId : undefined,
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

      <div className={cls.messageContainer}>
        {message && (
          <p id={messageId} className={error ? cls.errorMessage : cls.hintMessage}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};
