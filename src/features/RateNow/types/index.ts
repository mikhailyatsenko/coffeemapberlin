import { type ICharacteristicCounts } from 'shared/types';

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
export interface RateNowProps {
  showRateNow: boolean;
  setShowRateNow: React.Dispatch<React.SetStateAction<boolean>>;
  reviews: Review[];
  placeId: string;
  characteristicCounts: ICharacteristicCounts;
}
