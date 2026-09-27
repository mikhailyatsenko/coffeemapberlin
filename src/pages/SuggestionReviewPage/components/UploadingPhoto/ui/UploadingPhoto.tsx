import { isUploadable, type Photo, PHOTO_FAILURE_MESSAGES } from 'shared/lib/photoUpload';
import cls from './UploadingPhoto.module.scss';

interface UploadingPhotoProps {
  photo: Photo;
  onRetry: (id: string) => void;
  onRemove: (id: string) => void;
  /** A decision is on its way; a photo sent now would miss it. */
  disabled: boolean;
}

/** One of the admin's photos not stored yet: waiting or uploading, or failed with Retry. */
export const UploadingPhoto = ({ photo, onRetry, onRemove, disabled }: UploadingPhotoProps) => {
  const isFailed = photo.status === 'failed';

  return (
    <li className={cls.UploadingPhoto}>
      <div className={cls.frame}>
        <img className={cls.image} src={photo.localUrl} alt={photo.name} />
        {(photo.status === 'pending' || photo.status === 'uploading') && (
          <div className={cls.progress} role="progressbar" aria-label={`Upload progress for ${photo.name}`}>
            <div className={cls.progressFill} />
          </div>
        )}
        {isFailed && (
          <>
            <div className={cls.errorOverlay} aria-hidden="true" />
            <button
              className={cls.remove}
              type="button"
              onClick={() => {
                onRemove(photo.id);
              }}
              disabled={disabled}
              aria-label={`Remove ${photo.name}`}
            >
              <span aria-hidden="true">✕</span>
            </button>
          </>
        )}
      </div>
      {photo.reason && <p className={cls.error}>{PHOTO_FAILURE_MESSAGES[photo.reason]}</p>}
      {isFailed && isUploadable(photo) && (
        <button
          className={cls.retry}
          type="button"
          onClick={() => {
            onRetry(photo.id);
          }}
          disabled={disabled}
          aria-label={`Retry ${photo.name}`}
        >
          Retry
        </button>
      )}
    </li>
  );
};
