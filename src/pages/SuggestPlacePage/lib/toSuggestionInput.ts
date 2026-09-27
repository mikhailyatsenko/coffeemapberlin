import { type PlaceSuggestionInput } from 'shared/generated/graphql';
import { type SuggestPlaceFormValues } from '../types';

/**
 * The mutation input from validated, trimmed form values: blank optional fields
 * are left out, and the email is sent only for a Guest.
 */
export const toSuggestionInput = (
  { name, address, description, instagram, email }: SuggestPlaceFormValues,
  isSignedIn: boolean,
): PlaceSuggestionInput => ({
  name,
  address,
  ...(description && { description }),
  ...(instagram && { instagram }),
  ...(email && !isSignedIn && { email }),
});
