import clsx from 'clsx';
import { type ReactNode } from 'react';
// Deep imports: the module's index also carries the upload hook and its data access.
import { PHOTO_FAILURE_MESSAGES } from 'shared/lib/photoUpload/messages';
import { isUploadable, type Photo } from 'shared/lib/photoUpload/types';
import { RegularButton } from 'shared/ui/RegularButton';
import styles from './PhotoThumbnails.module.scss';

export interface PhotoThumbnailsProps {
  photos: Photo[];
  /** Removes a Photo before it is uploaded; without it, no remove buttons. */
  onRemove?: (id: string) => void;
  /** Resends a failed Photo; without it, no Retry. */
  onRetry?: (id: string) => void;
  /** Opens the picker again; without it, no "Add more". */
  onAddMore?: () => void;
  disabled?: boolean;
  /** More actions, shown before "Add more". */
  children?: ReactNode;
}

const canRetry = (photo: Photo) => photo.status === 'failed' && isUploadable(photo);

export const PhotoThumbnails: React.FC<PhotoThumbnailsProps> = ({
  photos,
  onRemove,
  onRetry,
  onAddMore,
  disabled = false,
  children,
}) => (
  <div className={styles.container}>
    <ul className={styles.imageGrid} aria-label={`${photos.length} photo${photos.length !== 1 ? 's' : ''}`}>
      {photos.map((photo, index) => (
        <li key={photo.id} className={clsx(styles.imageItem, photo.status === 'failed' && styles.failed)}>
          <div className={styles.imageWrapper}>
            <img className={styles.thumbnail} src={photo.localUrl} alt={`Photo ${index + 1}: ${photo.name}`} />

            {(photo.status === 'pending' || photo.status === 'uploading') && (
              <div
                className={clsx(styles.progressBar, photo.status === 'uploading' && styles.uploading)}
                role="progressbar"
                aria-label={`Upload progress for ${photo.name}`}
              >
                <div className={styles.progressFill} />
              </div>
            )}

            {photo.status === 'saved' && (
              <span className={styles.savedMark}>
                <span aria-hidden="true">✓</span>
                <span className="sr-only">Saved</span>
              </span>
            )}

            {photo.status === 'failed' && <div className={styles.errorOverlay} aria-hidden="true" />}

            {onRemove && !disabled && photo.status !== 'saved' && photo.status !== 'uploading' && (
              <button
                className={styles.removeButton}
                onClick={() => {
                  onRemove(photo.id);
                }}
                aria-label={`Remove photo ${index + 1}: ${photo.name}`}
                type="button"
              >
                <span aria-hidden="true">✕</span>
              </button>
            )}
          </div>

          {photo.reason && <p className={styles.errorText}>{PHOTO_FAILURE_MESSAGES[photo.reason]}</p>}

          {onRetry && canRetry(photo) && (
            <RegularButton
              size="sm"
              variant="ghost"
              disabled={disabled}
              onClick={() => {
                onRetry(photo.id);
              }}
              aria-label={`Retry ${photo.name}`}
            >
              Retry
            </RegularButton>
          )}
        </li>
      ))}
    </ul>

    {(children || onAddMore) && (
      <div className={styles.actions}>
        {children}

        {onAddMore && (
          <RegularButton
            leftIcon={<span aria-hidden="true">📎</span>}
            size="sm"
            variant="ghost"
            onClick={onAddMore}
            disabled={disabled}
          >
            Add more
          </RegularButton>
        )}
      </div>
    )}
  </div>
);
