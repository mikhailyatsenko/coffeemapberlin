import { generatePath, Link } from 'react-router-dom';
import { RoutePaths } from 'shared/constants';
import { PlaceSuggestionStatus } from 'shared/generated/graphql';
import { type SuggestionOutcome } from '../../../types';
import cls from './ReviewOutcome.module.scss';

interface ReviewOutcomeProps {
  outcome: SuggestionOutcome;
}

/** How a decided suggestion ended; nothing on the page can change it any more. */
export const ReviewOutcome = ({ outcome: { status, publishedPlaceId } }: ReviewOutcomeProps) => (
  <div className={cls.ReviewOutcome} role="status">
    {status === PlaceSuggestionStatus.published ? (
      <>
        <p className={cls.title}>Published. The Place is on the map.</p>
        {publishedPlaceId && (
          <Link className={cls.link} to={generatePath(`/${RoutePaths.placePage}`, { id: publishedPlaceId })}>
            Open the Place
          </Link>
        )}
      </>
    ) : (
      <p className={cls.title}>Rejected. The suggestion was discarded.</p>
    )}
  </div>
);
