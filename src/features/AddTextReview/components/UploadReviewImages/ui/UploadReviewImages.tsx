import { useRef, useEffect } from 'react';
import { type ImagesWrapper } from 'features/AddTextReview/types';
import { resizeAndConvertToJpeg } from 'shared/lib/image/processImage';
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
          const resized = await resizeAndConvertToJpeg(img);
          return new File([resized], img.name, { type: resized.type || 'image/jpeg' });
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

    // Освобождаем URL
    if (imageToRemove.localUrl) {
      URL.revokeObjectURL(imageToRemove.localUrl);
    }

    // Удаляем из массива
    const newImages = imagesWrappers.filter((_, i) => i !== index);
    setImagesWrappers(newImages);
  };

  const handleRemoveAll = () => {
    // Освобождаем все URL
    imagesWrappers.forEach((img) => {
      if (img.localUrl) {
        URL.revokeObjectURL(img.localUrl);
      }
    });

    setImagesWrappers([]);
  };

  // Очистка URL при размонтировании
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
    <div className={styles.UploadReviewImages}>
      <input ref={inputRef} type="file" accept="image/*" multiple onChange={onChange} style={{ display: 'none' }} />

      {!!imagesWrappers.length && (
        <>
          <ul className={styles.imageGrid}>
            {imagesWrappers.map((f, index) => (
              <li key={f.name} className={styles.imageItem}>
                <div className={styles.imageWrapper}>
                  <img className={styles.thumbnail} src={f.localUrl} alt={f.name} />

                  {/* Прогресс бар */}
                  {!f.error && (
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${f.progress}%` }} />
                    </div>
                  )}

                  {/* Индикатор ошибки */}
                  {f.error && (
                    <div className={styles.errorOverlay}>
                      <span>{f.error}</span>
                    </div>
                  )}

                  {/* Кнопка удаления */}
                  <button
                    className={styles.removeButton}
                    onClick={() => {
                      handleRemoveImage(index);
                    }}
                    aria-label="Remove image"
                    type="button"
                  >
                    ✕
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className={styles.actions}>
            <RegularButton onClick={handleRemoveAll} variant="ghost" size="sm">
              Remove all
            </RegularButton>

            {imagesWrappers?.length < 10 && (
              <RegularButton
                leftIcon={<span>📎</span>}
                size="sm"
                variant="ghost"
                onClick={handlePick}
                disabled={isProcessing}
              >
                Add more
              </RegularButton>
            )}
          </div>
        </>
      )}

      {!imagesWrappers.length && (
        <RegularButton
          leftIcon={<span>📎</span>}
          size="sm"
          variant="ghost"
          onClick={handlePick}
          disabled={isProcessing}
        >
          <b>{isProcessing ? 'Processing images...' : 'Add images'}</b> (up to 10)
        </RegularButton>
      )}
    </div>
  );
};
