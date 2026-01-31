import { useState } from 'react';
import { type SubmitHandler } from 'react-hook-form';
import { ContactForm, type ContactFormData } from 'entities/ContactForm/ui/ContactForm';
import { ErrorResultSendForm } from 'entities/ErrorResultSendForm';
import { SuccessResultSendForm } from 'entities/SuccessResultSendForm';
import { useContactFormMutation } from 'shared/generated/graphql';
import { Loader } from 'shared/ui/Loader';

export const SendContactForm = () => {
  const [contactForm, { loading, error, data, reset }] = useContactFormMutation();
  const [savedFormData, setSavedFormData] = useState<ContactFormData | null>(null);
  const [formKey, setFormKey] = useState(0);

  const onSubmit: SubmitHandler<ContactFormData> = async (formData) => {
    setSavedFormData(formData);
    await contactForm({
      variables: {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        // recaptcha: formData.recaptcha,
      },
    });
  };

  const handleTryAgain = () => {
    reset();
    setFormKey((prev) => prev + 1);
  };

  if (error) {
    return <ErrorResultSendForm handleTryAgain={handleTryAgain} />;
  }

  if (data?.contactForm.success) {
    return <SuccessResultSendForm name={data.contactForm.name} />;
  }

  return (
    <>
      {loading ? <Loader /> : ''}
      <ContactForm
        key={formKey}
        onSubmit={onSubmit}
        defaultValues={
          savedFormData || {
            name: '',
            email: '',
            message: '',
            recaptcha: '',
          }
        }
      />
    </>
  );
};
