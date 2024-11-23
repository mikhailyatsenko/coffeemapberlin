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
}
export const FormField: React.FC<FormFieldProps> = ({
  fieldName,
  type,
  value,
  error,
  labelText,
  autoComplete,
  autoFocus,
}) => {
  const { register } = useFormContext();
  const parameters = {
    placeholder: fieldName,
    type,
    value,
    autoComplete,
    autoFocus,
    id: fieldName,
    ...register(fieldName),
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
