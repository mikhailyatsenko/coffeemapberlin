import { type Characteristic, type CharacteristicCounts } from 'shared/generated/graphql';

export interface RateButtonProps {
  placeId: string;
  /** The person's current Rating for the Place, if any. */
  rating?: number | null;
  /** Takes the person to the "Been here? Rate it" block. */
  onClick: () => void;
}

export interface OneTapRatingProps {
  placeId: string;
  /** The person's current Rating for the Place, if any. */
  rating?: number | null;
  /** Called on a tap that starts a save, before the server answers. */
  onRate?: (rating: number) => void;
  /** Called once the server confirms a Rating, with the Review that holds it. */
  onSaved?: (rating: number, reviewId: string) => void;
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
  /** The person's own Review for the Place, if any. */
  ownReviewId?: string;
  /** How many Photos the person's own Review has. */
  ownReviewPhotoCount: number;
  ref?: React.Ref<RateBlockHandle>;
}

/** What the Place page can ask of the block from outside it. */
export interface RateBlockHandle {
  /** Scrolls to the block and focuses the beans, bringing them back if a Rating is shown. */
  focusBeans: () => void;
}

/** Toggles still saving in the block, shared by its parts so a second toggle can't undo the first. */
export interface SavingToggles {
  /** Characteristics whose toggle is still saving. */
  saving: readonly Characteristic[];
  /** Runs a toggle, keeping its Characteristic in `saving` until it settles. */
  whileSaving: (characteristic: Characteristic, save: () => Promise<void>) => Promise<void>;
}
