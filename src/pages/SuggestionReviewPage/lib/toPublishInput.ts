import { type PublishPlaceSuggestionInput } from 'shared/generated/graphql';
import { type PublishFormValues } from '../types';
import { parseCoordinates } from './coordinates';

/** The mutation input from validated, trimmed form values; blank optional fields are left out. */
export const toPublishInput = ({
  name,
  address,
  coordinates,
  neighborhood,
  description,
  instagram,
  website,
  phone,
  googlePlaceId,
}: PublishFormValues): PublishPlaceSuggestionInput => {
  const parsed = parseCoordinates(coordinates);
  // The schema has already checked the coordinates; this only narrows the type.
  if (!parsed) throw new Error('Coordinates must be validated before publishing');

  return {
    name,
    address,
    coordinates: parsed,
    neighborhood,
    ...(description && { description }),
    ...(instagram && { instagram }),
    ...(website && { website }),
    ...(phone && { phone }),
    ...(googlePlaceId && { googlePlaceId }),
  };
};
