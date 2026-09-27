import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useWatch } from 'react-hook-form';
import { type PlaceSuggestionForReviewQuery } from 'shared/generated/graphql';
import { validationSchema } from '../../../lib/validationSchema';
import { type PublishError, type PublishFormValues } from '../../../types';

type Suggestion = PlaceSuggestionForReviewQuery['placeSuggestionForReview'];

/** What was sent as a starting point; the rest the admin fills in. */
export type SentFields = Pick<Suggestion, 'name' | 'address' | 'description' | 'instagram'>;

/**
 * The Publish form, started from what was sent. `isDuplicate` holds while the
 * Google Place ID field still holds the one the server said is taken.
 */
export const usePublishForm = (sent: SentFields, publishError: PublishError | null) => {
  const form = useForm<PublishFormValues>({
    mode: 'onTouched',
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: sent.name,
      address: sent.address,
      coordinates: '',
      neighborhood: '',
      description: sent.description ?? '',
      instagram: sent.instagram ?? '',
      website: '',
      phone: '',
      googlePlaceId: '',
    },
  });
  const googlePlaceId = useWatch({ control: form.control, name: 'googlePlaceId' });
  const isDuplicate = publishError?.kind === 'duplicate' && publishError.googlePlaceId === googlePlaceId.trim();

  return { form, isDuplicate };
};
