import { type CharacteristicCounts } from 'shared/generated/graphql';

interface Review {
  id: string;
  text?: string;
  userId: string;
  userRating?: number;
  userName: string;
  userAvatar?: string;
  createdAt: string;
  isOwnReview: boolean;
}
export interface RateNowProps extends React.HTMLAttributes<HTMLDivElement> {
  showRateNow: boolean;
  setShowRateNow: React.Dispatch<React.SetStateAction<boolean>>;
  reviews: Review[];
  placeId: string;
  characteristicCounts: CharacteristicCounts;
}
