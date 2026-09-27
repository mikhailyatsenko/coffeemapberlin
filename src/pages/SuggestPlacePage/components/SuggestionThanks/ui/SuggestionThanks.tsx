import { Link } from 'react-router-dom';
import { isUploadable, type Photo } from 'shared/lib/photoUpload';
import { PhotoThumbnails } from 'shared/ui/PhotoThumbnails';
import cls from './SuggestionThanks.module.scss';

interface SuggestionThanksProps {
  /** Whether the suggester hears back when the Place is added. */
  willEmail: boolean;
  /** The picked photos, uploading to the suggestion one by one. */
  photos: Photo[];
  isUploading: boolean;
  onRetryPhoto: (photoId: string) => void;
}

export const SuggestionThanks = ({ willEmail, photos, isUploading, onRetryPhoto }: SuggestionThanksProps) => {
  // An unreadable photo was never sent, so it has no place among the uploads.
  const sent = photos.filter(isUploadable);
  const failed = sent.filter((photo) => photo.status === 'failed');

  return (
    <div className={cls.SuggestionThanks}>
      <div role="status">
        <p className={cls.title}>Thanks! We usually check suggestions within a couple of days.</p>
        {willEmail && <p>We&apos;ll email you when it&apos;s added.</p>}
      </div>
      {sent.length > 0 && (
        <section className={cls.photos} aria-label="Your photos">
          {isUploading && <p className={cls.note}>Uploading your photos…</p>}
          {failed.length > 0 && (
            <p className={cls.failed} role="alert">
              Not uploaded: {failed.map((photo) => photo.name).join(', ')}. Try again, or leave{' '}
              {failed.length === 1 ? 'it' : 'them'} out.
            </p>
          )}
          <PhotoThumbnails photos={sent} onRetry={onRetryPhoto} disabled={isUploading} />
        </section>
      )}
      <Link className={cls.back} to="/">
        Back to the map
      </Link>
    </div>
  );
};
