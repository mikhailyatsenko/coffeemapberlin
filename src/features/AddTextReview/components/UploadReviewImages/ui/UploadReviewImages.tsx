import React, { useRef } from 'react';
import { type ImageUploadProgress } from 'features/AddTextReview/types';
import { resizeAndConvertToJpeg } from 'shared/lib/image/processImage';
import { RegularButton } from 'shared/ui/RegularButton';

interface UploadReviewImagesProps {
  setImgsToUpload: (imgs: File[]) => void;
  filesProgress: ImageUploadProgress[];
  setFilesProgress: (filesProgress: ImageUploadProgress[]) => void;
  isProcessing: boolean;
}

export const UploadReviewImages: React.FC<UploadReviewImagesProps> = ({
  setImgsToUpload,
  filesProgress,
  setFilesProgress,
  isProcessing,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handlePick = () => {
    inputRef.current?.click();
  };

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const limited = files.slice(0, 10);
    try {
      const resizedFiles = await Promise.all(
        limited.map(async (img) => {
          const resized = await resizeAndConvertToJpeg(img);
          // If your resizeAndConvertToJpeg returns Blob, we must convert Blob to File
          // to keep File[] type for setImgsToUpload.
          // Otherwise, you may directly push resized if it's already File.
          return new File([resized], img.name, { type: resized.type || 'image/jpeg' });
        }),
      );
      setImgsToUpload(resizedFiles);
      setFilesProgress(limited.map((f) => ({ name: f.name, progress: 0, localUrl: URL.createObjectURL(f) })));
    } catch (error) {
      setImgsToUpload([]);
      setFilesProgress([]);
    }
  };

  return (
    <div>
      <input ref={inputRef} type="file" accept="image/*" multiple onChange={onChange} style={{ display: 'none' }} />

      {!!filesProgress.length && (
        <ul>
          {filesProgress.map((f) => (
            <li key={f.name}>
              <img className="" src={f.localUrl} alt={f.name} />
            </li>
          ))}
        </ul>
      )}
      {!filesProgress.length && (
        <RegularButton
          leftIcon={<span>📎</span>}
          size="sm"
          variant="ghost"
          onClick={handlePick}
          disabled={isProcessing}
        >
          <b>{isProcessing ? 'Processing images...' : 'Add images'}</b>(up to 10)
        </RegularButton>
      )}
    </div>
  );
};
