import { useRef } from 'react';
import { type PhotoUpload } from 'shared/lib/photoUpload';
import { PhotoThumbnails } from 'shared/ui/PhotoThumbnails';
import { RegularButton } from 'shared/ui/RegularButton';
import cls from './SuggestionPhotoPicker.module.scss';

interface SuggestionPhotoPickerProps {
  photoUpload: Pick<PhotoUpload, 'photos' | 'room' | 'roomNotice' | 'add' | 'remove'>;
  disabled: boolean;
}

/** Picks up to 10 photos of the Place and shows them, removable, until the suggestion is sent. */
export const SuggestionPhotoPicker = ({ photoUpload, disabled }: SuggestionPhotoPickerProps) => {
  const { photos, room, roomNotice, add, remove } = photoUpload;
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
    <div className={cls.SuggestionPhotoPicker} role="group" aria-labelledby="suggestion-photos-label">
      <p id="suggestion-photos-label" className={cls.label}>
        Photos of the Place (optional)
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={onChange}
        hidden
        aria-label="Add photos of the Place"
      />

      {photos.length > 0 ? (
        <PhotoThumbnails
          photos={photos}
          onRemove={remove}
          onAddMore={room > 0 ? handlePick : undefined}
          disabled={disabled}
        />
      ) : (
        <RegularButton
          leftIcon={<span aria-hidden="true">📎</span>}
          size="sm"
          variant="ghost"
          onClick={handlePick}
          disabled={disabled}
        >
          <b>Add photos</b> (up to {room})
        </RegularButton>
      )}

      <p className={cls.notice} role="status">
        {roomNotice}
      </p>
    </div>
  );
};
