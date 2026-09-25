import { type Characteristic, type CharacteristicCounts } from 'shared/generated/graphql';

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
  /** Whether the person's Review for the Place has Review text. */
  hasReviewText: boolean;
  /** Takes the person to the Review text form. */
  onAddReviewText: () => void;
}

/** Toggles still saving in the block, shared by its parts so a second toggle can't undo the first. */
export interface SavingToggles {
  /** Characteristics whose toggle is still saving. */
  saving: readonly Characteristic[];
  /** Runs a toggle, keeping its Characteristic in `saving` until it settles. */
  whileSaving: (characteristic: Characteristic, save: () => Promise<void>) => Promise<void>;
}
