import { PlaceSuggester, type PlaceSuggestionForReviewQuery } from 'shared/generated/graphql';
import cls from './SentSuggestion.module.scss';

interface SentSuggestionProps {
  suggestion: PlaceSuggestionForReviewQuery['placeSuggestionForReview'];
}

/** What the suggester sent, who they are, and other pending suggestions that may be the same Place. */
export const SentSuggestion = ({ suggestion }: SentSuggestionProps) => {
  const { name, address, description, instagram, suggestedBy, similarPending } = suggestion;

  return (
    <>
      <section className={cls.card} aria-labelledby="sent-title">
        <h2 id="sent-title" className={cls.heading}>
          What was sent
        </h2>
        <p className={cls.by}>Suggested by a {suggestedBy === PlaceSuggester.user ? 'User' : 'Guest'}</p>
        <dl className={cls.fields}>
          <dt>Name</dt>
          <dd>{name}</dd>
          <dt>Address</dt>
          <dd>{address}</dd>
          {description && (
            <>
              <dt>What makes it good</dt>
              <dd>{description}</dd>
            </>
          )}
          {instagram && (
            <>
              <dt>Instagram</dt>
              <dd>{instagram}</dd>
            </>
          )}
        </dl>
      </section>
      {similarPending.length > 0 && (
        <section className={cls.card} aria-labelledby="similar-title">
          <h2 id="similar-title" className={cls.heading}>
            Similar pending suggestions
          </h2>
          <ul className={cls.similar}>
            {similarPending.map((other) => (
              <li key={other.id}>
                {other.name}, {other.address}
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
};
