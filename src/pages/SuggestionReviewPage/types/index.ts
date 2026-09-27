import { type PlaceSuggestionStatus } from 'shared/generated/graphql';
import { type BERLIN_NEIGHBORHOODS } from '../constants';

/** One of Berlin's twelve; blank until the admin picks one. */
export type Neighborhood = (typeof BERLIN_NEIGHBORHOODS)[number];

export interface PublishFormValues {
  name: string;
  address: string;
  /** As Google Maps copies them: "52.51, 13.40". */
  coordinates: string;
  neighborhood: Neighborhood | '';
  description: string;
  instagram: string;
  website: string;
  phone: string;
  googlePlaceId: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

/** How the suggestion was decided; `publishedPlaceId` is set once it is published. */
export interface SuggestionOutcome {
  status: PlaceSuggestionStatus;
  publishedPlaceId?: string | null;
}

/** Why the last Publish failed. */
export type PublishError =
  | { kind: 'duplicate'; googlePlaceId: string; existingPlaceId: string | null }
  | { kind: 'failed' };

/** A Google Place ID matched to the suggestion; `existingPlaceId` is set when a Place already has it. */
export interface GoogleIdCandidate {
  googleId: string;
  existingPlaceId: string | null;
}

/** "Find on Google": up to three free Google Place ID candidates, asked for on a press. */
export interface GoogleIdLookup {
  find: () => void;
  /** Null until Google has answered; an empty list means it found nothing. */
  candidates: GoogleIdCandidate[] | null;
  isFinding: boolean;
  findFailed: boolean;
}
