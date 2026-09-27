import { Link } from 'react-router-dom';
import { RegularButton } from 'shared/ui/RegularButton';
import { googleMapsUrl, placePath } from '../../../lib/links';
import { type GoogleIdLookup } from '../../../types';
import cls from './FindOnGoogle.module.scss';

interface FindOnGoogleProps {
  lookup: GoogleIdLookup;
  /** Puts the chosen ID into the Google Place ID field. */
  onUse: (googleId: string) => void;
}

/** "Find on Google" and its candidates: each opens in Google Maps to check, with "Use" unless a Place already has it. */
export const FindOnGoogle = ({ lookup: { find, candidates, isFinding, findFailed }, onUse }: FindOnGoogleProps) => {
  const results = () => {
    if (findFailed) {
      return (
        <p className={cls.error} role="alert">
          We couldn&apos;t ask Google. Please try again.
        </p>
      );
    }
    if (!candidates) return null;
    if (candidates.length === 0) {
      return <p className={cls.note}>Google found nothing, you can publish without it</p>;
    }

    return (
      <ul className={cls.candidates} aria-label="Google candidates">
        {candidates.map(({ googleId, existingPlaceId }) => (
          <li key={googleId} className={cls.candidate}>
            <a className={cls.mapsLink} href={googleMapsUrl(googleId)} target="_blank" rel="noopener noreferrer">
              {googleId}
            </a>
            {existingPlaceId ? (
              <span className={cls.onMap}>
                Already on the map. <Link to={placePath(existingPlaceId)}>Open that Place</Link>
              </span>
            ) : (
              <RegularButton
                size="sm"
                onClick={() => {
                  onUse(googleId);
                }}
              >
                Use
              </RegularButton>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className={cls.FindOnGoogle}>
      <RegularButton size="sm" onClick={find} loading={isFinding}>
        Find on Google
      </RegularButton>
      {!isFinding && results()}
    </div>
  );
};
