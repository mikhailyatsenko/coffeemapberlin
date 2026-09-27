import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useWatch } from 'react-hook-form';
import { type PlaceSuggestionForReviewQuery } from 'shared/generated/graphql';
import { validationSchema } from '../../../lib/validationSchema';
import { type GoogleIdCandidate, type PublishError, type PublishFormValues } from '../../../types';

type Suggestion = PlaceSuggestionForReviewQuery['placeSuggestionForReview'];

/** What was sent as a starting point; the rest the admin fills in. */
export type SentFields = Pick<Suggestion, 'name' | 'address' | 'description' | 'instagram' | 'photos'>;

/** A Place that already has the Google Place ID in the field; its id is unknown when the server didn't name it. */
interface GoogleIdOwner {
  placeId: string | null;
}

/**
 * The Publish form, started from what was sent, all stored photos in upload order. `googleIdOwner` is set while
 * the Google Place ID field holds an ID that belongs to a Place: one the server
 * rejected as a duplicate, or a Google candidate already on the map.
 */
export const usePublishForm = (
  sent: SentFields,
  publishError: PublishError | null,
  candidates: GoogleIdCandidate[] | null,
) => {
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
      photoPaths: sent.photos,
    },
  });
  const googlePlaceId = useWatch({ control: form.control, name: 'googlePlaceId' });
  const googleId = googlePlaceId.trim();
  const photoPaths = useWatch({ control: form.control, name: 'photoPaths' });

  const findOwner = (): GoogleIdOwner | null => {
    if (!googleId) return null;
    if (publishError?.kind === 'duplicate' && publishError.googlePlaceId === googleId) {
      return { placeId: publishError.existingPlaceId };
    }
    const onMap = candidates?.find((candidate) => candidate.googleId === googleId && candidate.existingPlaceId);
    return onMap ? { placeId: onMap.existingPlaceId } : null;
  };

  const chooseGoogleId = (id: string) => {
    form.setValue('googlePlaceId', id, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
  };

  /** Changes the photo list from its latest value, so an upload or delete that settles later sees the others. */
  const updatePhotoPaths = (change: (paths: string[]) => string[]) => {
    form.setValue('photoPaths', change(form.getValues('photoPaths')), { shouldDirty: true });
  };

  return { form, googleIdOwner: findOwner(), chooseGoogleId, photoPaths, updatePhotoPaths };
};
