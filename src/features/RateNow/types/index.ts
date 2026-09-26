import { type Characteristic, type CharacteristicCounts } from 'shared/generated/graphql';

export interface RateButtonProps {
  placeId: string;
  /** The person's current Rating for the Place, if any. */
  rating?: number | null;
  /** Takes the person to the "Been here? Rate it" block. */
  onClick: () => void;
}

/** Where a contribution was made, sent with `rating_saved` and `contribution_failed`. */
export type SurfaceParams =
  | { surface: 'place_page' }
  | {
      surface: 'neighborhood_card';
      /** The page section the card sits in: `top_rated`, a Shortlist id or `all`. */
      section: string;
    };

export interface OneTapRatingProps {
  placeId: string;
  /** Where the beans are. On the Place page, its queries refresh after a save. */
  surfaceParams: SurfaceParams;
  /** The person's current Rating for the Place, if any. */
  rating?: number | null;
  /** Called on a tap that starts a save, before the server answers. */
  onRate?: (rating: number) => void;
  /** Called once the server confirms a Rating, with the Review that holds it. */
  onSaved?: (rating: number, reviewId: string) => void;
  /** Called when a save fails; the beans are back on the previous Rating and show the message. */
  onFailed?: () => void;
}

export interface CardContributionProps {
  placeId: string;
  /** The person's own Rating for the Place, if any. */
  ownRating?: number | null;
  /** The Characteristics the person marked in their own Review for the Place, if any. */
  ownCharacteristics?: readonly Characteristic[] | null;
  /** The page section the card sits in, for analytics. */
  section: string;
  /** The Characteristic to ask about once the person has a Rating; none on cards that ask nothing. */
  question?: Characteristic;
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
