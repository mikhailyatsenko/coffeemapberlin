import { useRef } from 'react';
import { MAX_PHOTOS } from 'shared/lib/photoUpload';
import { RegularButton } from 'shared/ui/RegularButton';
import { type ReviewPhotos } from '../../../model/useReviewPhotos';
import { StoredPhoto } from '../../StoredPhoto';
import { UploadingPhoto } from '../../UploadingPhoto';
import cls from './KeptPhotos.module.scss';

interface KeptPhotosProps {
  photos: ReviewPhotos;
  /** A decision is on its way; the photos wait. */
  disabled: boolean;
}

/**
 * The photos that go live with the Place, the first as its card image: the suggestion's stored photos, then the
 * admin's own on their way up.
 */
export const KeptPhotos = ({ photos, disabled }: KeptPhotosProps) => {
  const { paths, uploads, room, roomNotice, deletingPath, deleteFailed } = photos;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isEmpty = paths.length === 0 && uploads.length === 0;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // Lets the same file be picked again.
    e.target.value = '';
    if (files.length) void photos.pick(files);
  };

  return (
    <section className={cls.KeptPhotos} aria-labelledby="kept-photos-title">
      <h3 id="kept-photos-title" className={cls.heading}>
        Photos
      </h3>
      {isEmpty ? (
        <p className={cls.note}>No photos, the Place keeps the default card image</p>
      ) : (
        <ul className={cls.grid} aria-label="Photos to publish">
          {paths.map((path, index) => (
            <StoredPhoto
              key={path}
              path={path}
              position={index + 1}
              onMakeCardImage={photos.makeCardImage}
              onDelete={photos.deleteStoredPhoto}
              isDeleting={deletingPath === path}
              disabled={disabled || deletingPath !== null}
            />
          ))}
          {uploads.map((photo) => (
            <UploadingPhoto
              key={photo.id}
              photo={photo}
              onRetry={photos.retry}
              onRemove={photos.removeUpload}
              disabled={disabled}
            />
          ))}
        </ul>
      )}
      {deleteFailed && (
        <p className={cls.error} role="alert">
          We couldn&apos;t delete the photo. Please try again.
        </p>
      )}
      {room > 0 ? (
        <>
          {/* No `capture`, so phones offer the library as well as the camera. */}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={onChange}
            aria-label="Add Place photos"
          />
          <RegularButton
            className={cls.add}
            leftIcon={<span aria-hidden="true">📷</span>}
            size="sm"
            variant="ghost"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
          >
            Add photos (up to {room})
          </RegularButton>
        </>
      ) : (
        <p className={cls.note}>{MAX_PHOTOS} photos, the most allowed. Delete one to add another</p>
      )}
      <p className={cls.note} aria-live="polite">
        {roomNotice}
      </p>
    </section>
  );
};
