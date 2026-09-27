import { useState } from 'react';
import { photoThumbnailUrl } from '../../../lib/links';
import cls from './StoredPhoto.module.scss';

interface StoredPhotoProps {
  path: string;
  /** Its place in the list, from 1; the first is the card image. */
  position: number;
  onMakeCardImage: (path: string) => void;
  onDelete: (path: string) => void;
  isDeleting: boolean;
  disabled: boolean;
}

/** One stored photo of the suggestion: made the card image, or deleted for good after Delete/Cancel. */
export const StoredPhoto = ({ path, position, onMakeCardImage, onDelete, isDeleting, disabled }: StoredPhotoProps) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const isCardImage = position === 1;

  return (
    <li className={cls.StoredPhoto}>
      <div className={cls.frame}>
        <img
          className={cls.image}
          src={photoThumbnailUrl(path)}
          alt={isCardImage ? `Photo ${position}, the card image` : `Photo ${position}`}
          loading="lazy"
        />
        {isCardImage && (
          <span className={cls.cardMark} aria-hidden="true">
            Card image
          </span>
        )}
        {isConfirming || isDeleting ? (
          <div className={cls.confirm} role="group" aria-label={`Delete photo ${position}?`}>
            <button
              className={cls.confirmDelete}
              type="button"
              onClick={() => {
                setIsConfirming(false);
                onDelete(path);
              }}
              disabled={isDeleting}
              aria-busy={isDeleting || undefined}
            >
              {isDeleting ? 'Deleting…' : 'Delete'}
            </button>
            {!isDeleting && (
              <button
                className={cls.confirmCancel}
                type="button"
                onClick={() => {
                  setIsConfirming(false);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          <button
            className={cls.delete}
            type="button"
            onClick={() => {
              setIsConfirming(true);
            }}
            disabled={disabled}
            aria-label={`Delete photo ${position}`}
          >
            <span aria-hidden="true">✕</span>
          </button>
        )}
      </div>
      {!isCardImage && (
        <button
          className={cls.makeCard}
          type="button"
          onClick={() => {
            onMakeCardImage(path);
          }}
          disabled={disabled}
          aria-label={`Make photo ${position} the card image`}
        >
          Make card image
        </button>
      )}
    </li>
  );
};
