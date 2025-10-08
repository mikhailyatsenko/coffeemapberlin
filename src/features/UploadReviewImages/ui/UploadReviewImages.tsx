//
import React, { useCallback, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useUploadReviewImagesMutation } from 'shared/generated/graphql';
import { useAuthStore } from 'shared/stores/auth';
import { showLoginRequired } from 'shared/stores/modal';
import { Loader } from 'shared/ui/Loader';
import { RegularButton } from 'shared/ui/RegularButton';
import cls from './UploadReviewImages.module.scss';

interface UploadReviewImagesProps {
  placeId: string;
}

const MAX_FILES = 10;
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB per file
const ACCEPTED_MIME = ['image/jpeg', 'image/png'];

// Using generated types and hook

export const UploadReviewImages: React.FC<UploadReviewImagesProps> = ({ placeId }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { user } = useAuthStore();

  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [uploadReviewImages] = useUploadReviewImagesMutation();

  const openPicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const validateAndSetFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return;
    const next: File[] = [];
    for (let i = 0; i < incoming.length; i++) {
      const f = incoming.item(i);
      if (!f) continue;
      if (!ACCEPTED_MIME.includes(f.type)) {
        setError('Only JPEG and PNG files are allowed');
        return;
      }
      if (f.size > MAX_SIZE_BYTES) {
        setError('Each file must be under 5MB');
        return;
      }
      next.push(f);
      if (next.length >= MAX_FILES) break;
    }
    if (next.length === 0) return;
    setError(null);
    setFiles((prev) => {
      const combined = [...prev, ...next].slice(0, MAX_FILES);
      return combined;
    });
  }, []);

  const removeAt = useCallback((idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  }, []);

  const clearAll = useCallback(() => {
    setFiles([]);
    setError(null);
  }, []);

  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);

  const toBase64 = async (file: File): Promise<string> => {
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = (e) => {
        reject(e);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = useCallback(async () => {
    if (!user) {
      showLoginRequired();
      return;
    }
    if (files.length === 0) return;
    setIsUploading(true);
    setError(null);
    try {
      const base64s = await Promise.all(files.map(toBase64));
      const { data } = await uploadReviewImages({ variables: { placeId, images: base64s } });
      if (data?.uploadReviewImages?.success) {
        toast.success(`Uploaded ${data.uploadReviewImages.count} image(s)`);
        setFiles([]);
      } else {
        setError('Failed to upload images');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  }, [files, placeId, uploadReviewImages, user]);

  return (
    <div className={cls.container}>
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_MIME.join(',')}
        multiple
        className="visually-hidden"
        onChange={(e) => {
          validateAndSetFiles(e.target.files);
        }}
      />

      <div className={cls.controls}>
        <RegularButton onClick={openPicker} variant="ghost">
          Select images
        </RegularButton>
        <RegularButton onClick={handleUpload} disabled={files.length === 0 || isUploading}>
          {isUploading ? 'Uploading…' : 'Upload'}
        </RegularButton>
        {files.length > 0 && (
          <RegularButton variant="ghost" theme="neutral" onClick={clearAll}>
            Clear
          </RegularButton>
        )}
        <span className={cls.hint}>
          {files.length}/{MAX_FILES} selected • JPEG/PNG up to 5MB
        </span>
      </div>

      {error && <div className={cls.error}>{error}</div>}

      <div className={cls.previews}>
        {previews.map((src, idx) => (
          <div key={src}>
            <img src={src} alt="preview" className={cls.thumb} />
            <RegularButton
              variant="ghost"
              theme="error"
              onClick={() => {
                removeAt(idx);
              }}
            >
              Remove
            </RegularButton>
          </div>
        ))}
      </div>

      {isUploading && <Loader />}
    </div>
  );
};

export default UploadReviewImages;
