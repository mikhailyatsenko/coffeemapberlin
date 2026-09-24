import { type CharacteristicCounts } from 'shared/generated/graphql';

interface Review {
  id: string;
  text?: string;
  /** Null for guest reviews, which have no account behind them. */
  userId?: string | null;
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

export interface OneTapRatingProps {
  placeId: string;
  /** The person's current Rating for the Place, if any. */
  rating?: number | null;
  /** Called on a tap that starts a save, before the server answers. */
  onRate?: (rating: number) => void;
  /** Called once the server confirms a Rating. */
  onSaved?: (rating: number) => void;
  /** Called when a save fails; the beans are back on the previous Rating and show the message. */
  onFailed?: () => void;
}

export interface RateBlockProps extends Pick<OneTapRatingProps, 'placeId' | 'rating'> {
  /** The Place's Characteristic counts; `pressed` says which the person has marked. */
  characteristicCounts: CharacteristicCounts;
}
