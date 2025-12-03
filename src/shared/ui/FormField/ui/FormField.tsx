import type { ChangeEvent } from 'react';
import { useFormContext } from 'react-hook-form';
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
  onValueChange?: (value: string) => void;
}
export const FormField: React.FC<FormFieldProps> = ({
  fieldName,
  type,
  value,
  error,
  labelText,
  autoComplete,
  autoFocus,
  onValueChange,
}) => {
  const { register } = useFormContext();
  const registered = register(fieldName);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    registered.onChange(event);
    onValueChange?.(event.target.value);
  };

  const parameters = {
    placeholder: fieldName,
    type,
    value,
    autoComplete,
    autoFocus,
    id: fieldName,
    ...registered,
    onChange: handleChange,
  };
  return (
    <div className={`${cls.formGroup} ${type === 'hidden' ? cls.hiddenGroup : ''}`}>
      {!(type === 'textarea') ? (
        <input className={`${cls.formField} ${error ? cls.error : ''}`} {...parameters} />
      ) : (
        <textarea className={`${cls.formField} ${error ? cls.error : ''}`} rows={4} {...parameters} />
      )}

      <label className={cls.formLabel} htmlFor={fieldName}>
        {labelText}
      </label>

      <div className={cls.errorContainer}>{error && <p className={cls.errorMessage}>{error}</p>}</div>
    </div>
  );
};
