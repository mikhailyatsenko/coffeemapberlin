import { type PlaceReviewsQuery } from 'shared/generated/graphql';
import { type ICharacteristicCounts } from 'shared/types';

export interface RateNowProps {
  showRateNow: boolean;
  setShowRateNow: React.Dispatch<React.SetStateAction<boolean>>;
  reviews: PlaceReviewsQuery['placeReviews']['reviews'];
  placeId: string;
  characteristicCounts: ICharacteristicCounts;
}
