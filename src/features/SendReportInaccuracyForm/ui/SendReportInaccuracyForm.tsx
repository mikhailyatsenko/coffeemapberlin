import { useState } from 'react';
import { type SubmitHandler } from 'react-hook-form';
import { ErrorResultSendForm } from 'entities/ErrorResultSendForm';
import { ReportInaccuracyForm, type ReportInaccuracyFormData } from 'entities/ReportInaccuracyForm';
import { SuccessResultSendForm } from 'entities/SuccessResultSendForm';
import { useReportInaccuracyMutation } from 'shared/generated/graphql';
import { Loader } from 'shared/ui/Loader';

interface SendReportInaccuracyFormProps {
  placeId: string;
  placeName: string;
}

export const SendReportInaccuracyForm = ({ placeId, placeName }: SendReportInaccuracyFormProps) => {
  const [reportInaccuracy, { loading, error, data, reset }] = useReportInaccuracyMutation();
  const [savedFormData, setSavedFormData] = useState<ReportInaccuracyFormData | null>(null);
  const [formKey, setFormKey] = useState(0);

  const onSubmit: SubmitHandler<ReportInaccuracyFormData> = async (formData) => {
    setSavedFormData(formData);
    await reportInaccuracy({
      variables: {
        placeId: formData.placeId,
        placeName: formData.placeName,
        message: formData.message,
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

  if (data?.reportInaccuracy.success) {
    return <SuccessResultSendForm name={data.reportInaccuracy.placeName} />;
  }

  return (
    <>
      {loading ? <Loader /> : ''}
      <ReportInaccuracyForm
        key={formKey}
        onSubmit={onSubmit}
        defaultValues={
          savedFormData || {
            placeId,
            placeName,
            message: '',
            recaptcha: '',
          }
        }
      />
    </>
  );
};
