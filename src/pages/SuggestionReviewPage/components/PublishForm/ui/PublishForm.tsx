import { FormProvider } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { FormField } from 'shared/ui/FormField';
import { RegularButton } from 'shared/ui/RegularButton';
import { BERLIN_NEIGHBORHOODS } from '../../../constants';
import { placePath } from '../../../lib/links';
import { useReviewPhotos } from '../../../model/useReviewPhotos';
import { type GoogleIdLookup, type PublishError, type PublishFormValues, type ReviewLink } from '../../../types';
import { FindOnGoogle } from '../../FindOnGoogle';
import { KeptPhotos } from '../../KeptPhotos';
import { type SentFields, usePublishForm } from '../model/usePublishForm';
import cls from './PublishForm.module.scss';

interface PublishFormProps {
  /** What was sent; the form starts from it. */
  suggestion: SentFields;
  /** Authorizes the admin's photo uploads and deletes. */
  reviewLink: ReviewLink;
  onPublish: (values: PublishFormValues) => Promise<void>;
  /** Why the last Publish failed; the form keeps its values. */
  publishError: PublishError | null;
  /** "Find on Google" for the Google Place ID field. */
  googleIdLookup: GoogleIdLookup;
  /** A Reject is on its way; Publish waits for it. */
  disabled?: boolean;
}

/**
 * The Place as it will go live. Publish stays disabled until it has a name, address, a pin in Berlin and a
 * Neighborhood, and while a photo is uploading or being deleted.
 */
export const PublishForm = ({
  suggestion,
  reviewLink,
  onPublish,
  publishError,
  googleIdLookup,
  disabled = false,
}: PublishFormProps) => {
  const { form, googleIdOwner, chooseGoogleId, photoPaths, updatePhotoPaths } = usePublishForm(
    suggestion,
    publishError,
    googleIdLookup.candidates,
  );
  const photos = useReviewPhotos(reviewLink, photoPaths, updatePhotoPaths);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = form;

  return (
    <FormProvider {...form}>
      <form className={cls.PublishForm} onSubmit={handleSubmit(onPublish)} noValidate aria-labelledby="publish-title">
        <h2 id="publish-title" className={cls.heading}>
          Publish as a Place
        </h2>
        <FormField labelText="Name" fieldName="name" type="text" error={errors.name?.message} />
        <FormField labelText="Address" fieldName="address" type="text" error={errors.address?.message} />
        <FormField
          labelText="Coordinates (lat, lng)"
          fieldName="coordinates"
          type="text"
          error={errors.coordinates?.message}
        />
        <p className={cls.caption}>Copy them from the pin in Google Maps, e.g. 52.51, 13.40</p>
        <div className={cls.selectGroup}>
          <label className={cls.selectLabel} htmlFor="neighborhood">
            Neighborhood
          </label>
          <select
            id="neighborhood"
            className={`${cls.select} ${errors.neighborhood ? cls.invalid : ''}`}
            {...register('neighborhood')}
          >
            <option value="">Choose one of the twelve</option>
            {BERLIN_NEIGHBORHOODS.map((neighborhood) => (
              <option key={neighborhood} value={neighborhood}>
                {neighborhood}
              </option>
            ))}
          </select>
          {errors.neighborhood && <p className={cls.fieldError}>{errors.neighborhood.message}</p>}
        </div>
        <FormField
          labelText="Description (optional)"
          fieldName="description"
          type="textarea"
          error={errors.description?.message}
        />
        <FormField
          labelText="Instagram (optional)"
          fieldName="instagram"
          type="text"
          error={errors.instagram?.message}
        />
        <FormField labelText="Website (optional)" fieldName="website" type="url" error={errors.website?.message} />
        <FormField labelText="Phone (optional)" fieldName="phone" type="tel" error={errors.phone?.message} />
        <FormField
          labelText="Google Place ID (optional)"
          fieldName="googlePlaceId"
          type="text"
          error={errors.googlePlaceId?.message}
        />
        <FindOnGoogle lookup={googleIdLookup} onUse={chooseGoogleId} />
        <KeptPhotos photos={photos} disabled={disabled || isSubmitting} />
        {googleIdOwner ? (
          <p className={cls.submitError} role="alert">
            This Google Place ID already belongs to a Place.{' '}
            {googleIdOwner.placeId && <Link to={placePath(googleIdOwner.placeId)}>Open that Place</Link>}
          </p>
        ) : (
          publishError?.kind === 'failed' && (
            <p className={cls.submitError} role="alert">
              We couldn&apos;t publish it. Please try again.
            </p>
          )
        )}
        <RegularButton
          className={cls.publishButton}
          size="lg"
          theme="success"
          type="submit"
          disabled={!isValid || Boolean(googleIdOwner) || disabled || photos.isBusy}
          loading={isSubmitting}
        >
          Publish
        </RegularButton>
      </form>
    </FormProvider>
  );
};
