import { Helmet } from 'react-helmet';
import { useParams, useSearchParams } from 'react-router-dom';
import { Loader } from 'shared/ui/Loader';
import { RegularButton } from 'shared/ui/RegularButton';
import { useGoogleIdLookup } from '../api/useGoogleIdLookup';
import { PublishForm } from '../components/PublishForm';
import { ReviewOutcome } from '../components/ReviewOutcome';
import { SentSuggestion } from '../components/SentSuggestion';
import { useSuggestionReview } from '../model/useSuggestionReview';
import cls from './SuggestionReviewPage.module.scss';

/** The admin's page for one Place suggestion, opened from the link in their email (ADR 0002). */
export const SuggestionReviewPage = () => {
  const { id = '' } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const review = useSuggestionReview(id, token);
  const googleIdLookup = useGoogleIdLookup(id, token);
  const { suggestion, outcome } = review;

  const content = () => {
    if (review.isInvalidLink) return <p className={cls.message}>This link is not valid</p>;
    if (review.isLoading) return <Loader />;
    if (review.loadFailed || !suggestion) {
      return <p className={cls.message}>We couldn&apos;t load this suggestion. Please reload the page.</p>;
    }
    if (outcome) return <ReviewOutcome outcome={outcome} />;

    return (
      <>
        <SentSuggestion suggestion={suggestion} />
        <PublishForm
          suggestion={suggestion}
          onPublish={review.publish}
          publishError={review.publishError}
          googleIdLookup={googleIdLookup}
          disabled={review.isDeciding}
        />
        <div className={cls.reject}>
          <p className={cls.rejectHint}>Spam, a duplicate or not a Place for the map?</p>
          <RegularButton
            theme="error"
            onClick={review.reject}
            loading={review.isRejecting}
            disabled={review.isDeciding}
          >
            Reject
          </RegularButton>
          {review.rejectFailed && (
            <p className={cls.error} role="alert">
              We couldn&apos;t reject it. Please try again.
            </p>
          )}
        </div>
      </>
    );
  };

  return (
    <main className={`${cls.SuggestionReviewPage} container`}>
      <Helmet>
        <title>Review a Place suggestion | Berlin Coffee Map</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <h1 className={cls.title}>Review a Place suggestion</h1>
      {content()}
    </main>
  );
};
