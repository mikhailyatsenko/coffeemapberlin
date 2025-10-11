import { useRef, useEffect } from 'react';
import { type ImagesWrapper } from 'features/AddTextReview/types';
import { resizeAndConvert } from 'shared/lib/image/processImage';
import { RegularButton } from 'shared/ui/RegularButton';
import styles from './UploadReviewImages.module.scss';

interface UploadReviewImagesProps {
  imagesWrappers: ImagesWrapper[];
  setImagesWrappers: React.Dispatch<React.SetStateAction<ImagesWrapper[]>>;
  isProcessing: boolean;
}

export const UploadReviewImages: React.FC<UploadReviewImagesProps> = ({
  imagesWrappers,
  setImagesWrappers,
  isProcessing,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handlePick = () => {
    inputRef.current?.click();
  };

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const totalAllowed = 10 - imagesWrappers.length;
    const limited = files.slice(0, totalAllowed);

    try {
      const resizedFiles = await Promise.all(
        limited.map(async (img) => {
          const resized = await resizeAndConvert(img);

          const originalName = img.name.replace(/\.[^/.]+$/, '');
          return new File([resized] as BlobPart[], `${originalName}.jpg`, { type: resized.type || 'image/webp' });
        }),
      );

      setImagesWrappers((prev: ImagesWrapper[]) => [
        ...prev,
        ...resizedFiles.map((f) => ({
          name: f.name,
          file: f,
          progress: 0,
          localUrl: URL.createObjectURL(f),
          error: '',
        })),
      ]);
    } catch (error) {
      setImagesWrappers([]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const imageToRemove = imagesWrappers[index];

    if (imageToRemove.localUrl) {
      URL.revokeObjectURL(imageToRemove.localUrl);
    }

    const newImages = imagesWrappers.filter((_, i) => i !== index);
    setImagesWrappers(newImages);
  };

  const handleRemoveAll = () => {
    imagesWrappers.forEach((img) => {
      if (img.localUrl) {
        URL.revokeObjectURL(img.localUrl);
      }
    });

    setImagesWrappers([]);
  };
  useEffect(() => {
    return () => {
      imagesWrappers.forEach((img) => {
        if (img.localUrl) {
          URL.revokeObjectURL(img.localUrl);
        }
      });
    };
  }, [imagesWrappers]);

  return (
    <div role="group" aria-labelledby="images-label">
      <div id="images-label" className="sr-only">
        Review Images
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={onChange}
        style={{ display: 'none' }}
        aria-label="Upload images for review"
      />

      {!!imagesWrappers.length && (
        <>
          <ul
            className={styles.imageGrid}
            role="list"
            aria-label={`${imagesWrappers.length} image${imagesWrappers.length !== 1 ? 's' : ''} selected`}
          >
            {imagesWrappers.map((f, index) => (
              <li key={f.name} className={styles.imageItem} role="listitem">
                <div className={styles.imageWrapper}>
                  <img
                    className={styles.thumbnail}
                    src={f.localUrl}
                    alt={`Review image ${index + 1}: ${f.name}`}
                    loading="lazy"
                  />

                  {!f.error && (
                    <div
                      className={styles.progressBar}
                      role="progressbar"
                      aria-valuenow={f.progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Upload progress for ${f.name}: ${f.progress}%`}
                    >
                      <div className={styles.progressFill} style={{ width: `${f.progress}%` }} />
                    </div>
                  )}

                  {f.error && (
                    <div className={styles.errorOverlay} role="alert" aria-live="polite">
                      <span>{f.error}</span>
                    </div>
                  )}

                  <button
                    className={styles.removeButton}
                    onClick={() => {
                      handleRemoveImage(index);
                    }}
                    aria-label={`Remove image ${index + 1}: ${f.name}`}
                    type="button"
                  >
                    <span aria-hidden="true">✕</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className={styles.actions} role="group" aria-label="Image actions">
            <RegularButton
              leftIcon={<span aria-hidden="true">❌</span>}
              onClick={handleRemoveAll}
              variant="ghost"
              size="sm"
              aria-label="Remove all images"
            >
              Remove all
            </RegularButton>

            {imagesWrappers?.length < 10 && (
              <RegularButton
                leftIcon={<span aria-hidden="true">📎</span>}
                size="sm"
                variant="ghost"
                onClick={handlePick}
                disabled={isProcessing}
                aria-label={`Add more images (${10 - imagesWrappers.length} remaining)`}
              >
                Add more
              </RegularButton>
            )}
          </div>
        </>
      )}

      {!imagesWrappers.length && (
        <RegularButton
          leftIcon={<span aria-hidden="true">📎</span>}
          size="sm"
          variant="ghost"
          onClick={handlePick}
          disabled={isProcessing}
          aria-label="Add images to review (up to 10 images allowed)"
        >
          <b>{isProcessing ? 'Processing images...' : 'Add images'}</b> (up to 10)
        </RegularButton>
      )}
    </div>
  );
};
