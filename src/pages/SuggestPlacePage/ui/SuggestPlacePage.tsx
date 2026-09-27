import { Helmet } from 'react-helmet';
import { SuggestionThanks } from '../components/SuggestionThanks';
import { SuggestPlaceForm } from '../components/SuggestPlaceForm';
import { useSubmitPlaceSuggestion } from '../model/useSubmitPlaceSuggestion';
import cls from './SuggestPlacePage.module.scss';

export const SuggestPlacePage = () => {
  const { suggester, submit, submitted, errorMessage, photoUpload, retryPhoto } = useSubmitPlaceSuggestion();

  return (
    <main className={`${cls.SuggestPlacePage} container`}>
      <Helmet>
        <title>Suggest a Place | Berlin Coffee Map</title>
      </Helmet>
      <h1 className={cls.title}>Suggest a Place</h1>
      {submitted ? (
        <SuggestionThanks
          willEmail={submitted.willEmail}
          photos={photoUpload.photos}
          isUploading={photoUpload.isUploading}
          onRetryPhoto={retryPhoto}
        />
      ) : (
        <>
          <p className={cls.subtitle}>Know a good Place that isn&apos;t on the map yet? Tell us about it.</p>
          <SuggestPlaceForm
            suggester={suggester}
            onSubmit={submit}
            errorMessage={errorMessage}
            photoUpload={photoUpload}
          />
        </>
      )}
    </main>
  );
};
