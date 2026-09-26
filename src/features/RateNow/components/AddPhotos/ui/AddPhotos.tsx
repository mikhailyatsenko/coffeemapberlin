import { PHOTO_FAILURE_MESSAGES } from 'shared/lib/photoUpload';
import { PhotoThumbnails } from 'shared/ui/PhotoThumbnails';
import { RegularButton } from 'shared/ui/RegularButton';

import { ErrorAlert } from '../../ErrorAlert';
import { useAddPhotos } from '../model/useAddPhotos';
import { type AddPhotosProps } from '../types';
import cls from './AddPhotos.module.scss';

/** "Add a photo" under the Rating: picked Photos upload to the Review at once, without Review text. */
export const AddPhotos = (props: AddPhotosProps) => {
  const { inputRef, photos, room, roomNotice, alertReason, savedCount, isBusy, openPicker, handlePick, retryPhoto } =
    useAddPhotos(props);

  // A full Review offers nothing, unless this page view already shows its Photos.
  if (!photos.length && room === 0) return null;

  return (
    <div className={cls.AddPhotos}>
      {/* No `capture`, so phones offer the library as well as the camera. */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handlePick}
        aria-label="Choose photos"
      />

      {photos.length ? (
        <PhotoThumbnails
          photos={photos}
          onRetry={retryPhoto}
          onAddMore={!isBusy && room > 0 ? openPicker : undefined}
          disabled={isBusy}
        />
      ) : (
        <RegularButton
          leftIcon={<span aria-hidden="true">📷</span>}
          size="sm"
          variant="ghost"
          onClick={openPicker}
          disabled={isBusy || !props.reviewId}
        >
          Add a photo
        </RegularButton>
      )}

      <p className={cls.status} role="status">
        {savedCount > 0 && <span>{`${savedCount} photo${savedCount !== 1 ? 's' : ''} added`}</span>}
        {roomNotice && <span>{roomNotice}</span>}
      </p>

      {alertReason && <ErrorAlert>{PHOTO_FAILURE_MESSAGES[alertReason]}</ErrorAlert>}
    </div>
  );
};
