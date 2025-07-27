import { type SubmitHandler } from 'react-hook-form';
import { ContactForm, type ContactFormData } from 'entities/ContactForm/ui/ContactForm';
import { ErrorResultSendForm } from 'entities/ErrorResultSendForm';
import { SuccessResultSendForm } from 'entities/SuccessResultSendForm';
import { useContactFormMutation } from 'shared/generated/graphql';
import { Loader } from 'shared/ui/Loader';

export const SendContactForm = () => {
  const [contactForm, { loading, error, data, reset }] = useContactFormMutation();

  const onSubmit: SubmitHandler<ContactFormData> = async (formData) => {
    await contactForm({
      variables: {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        recaptcha: formData.recaptcha,
      },
    });
  };

  const handleTryAgain = () => {
    reset();
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
      <ContactForm onSubmit={onSubmit} />
    </>
  );
};
