import { useRef } from 'react';
import { type PhotoUpload } from 'shared/lib/photoUpload';
import { PhotoThumbnails } from 'shared/ui/PhotoThumbnails';
import { RegularButton } from 'shared/ui/RegularButton';

interface ReviewPhotoPickerProps {
  photoUpload: Pick<PhotoUpload, 'photos' | 'room' | 'roomNotice' | 'add' | 'remove' | 'removeAll'>;
  isProcessing: boolean;
}

/** Picks Photos for the Review text form and shows them until the form uploads them. */
export const ReviewPhotoPicker: React.FC<ReviewPhotoPickerProps> = ({ photoUpload, isProcessing }) => {
  const { photos, room, roomNotice, add, remove, removeAll } = photoUpload;
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handlePick = () => {
    inputRef.current?.click();
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // Lets the same file be picked again after it was removed.
    e.target.value = '';
    if (files.length) void add(files);
  };

  return (
    <div role="group" aria-label="Review Images">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={onChange}
        style={{ display: 'none' }}
        aria-label="Upload images for review"
      />

      {!!photos.length && (
        <PhotoThumbnails
          photos={photos}
          onRemove={remove}
          onAddMore={room > 0 ? handlePick : undefined}
          disabled={isProcessing}
        >
          <RegularButton
            leftIcon={<span aria-hidden="true">❌</span>}
            onClick={removeAll}
            variant="ghost"
            size="sm"
            aria-label="Remove all images"
            disabled={isProcessing}
          >
            Remove all
          </RegularButton>
        </PhotoThumbnails>
      )}

      {!photos.length && room > 0 && (
        <RegularButton
          leftIcon={<span aria-hidden="true">📎</span>}
          size="sm"
          variant="ghost"
          onClick={handlePick}
          disabled={isProcessing}
          aria-label={`Add images to review (up to ${room} allowed)`}
        >
          <b>Add images</b> (up to {room})
        </RegularButton>
      )}

      <p role="status" style={{ margin: 0 }}>
        {roomNotice}
      </p>
    </div>
  );
};
