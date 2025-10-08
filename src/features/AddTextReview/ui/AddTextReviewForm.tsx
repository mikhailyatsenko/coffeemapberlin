import clsx from 'clsx';
import { debounce } from 'lodash-es';
import React, { useCallback, useEffect, useMemo, useRef, useState, memo } from 'react';
import {
  useAddTextReviewMutation,
  useUploadReviewImagesMutation,
  PlaceReviewsDocument,
} from 'shared/generated/graphql';
import { useAuthStore } from 'shared/stores/auth';
import { showLoginRequired } from 'shared/stores/modal';
import { RegularButton } from 'shared/ui/RegularButton';
import { useAddTextReviewDraftStore } from '../model';
import { type AddTextReviewFormProps } from '../types';
import cls from './AddTextReviewForm.module.scss';

const AddTextReviewFormComponent: React.FC<AddTextReviewFormProps> = ({
  placeId,
  initialValue = '',
  className,
  onSubmitted,
  onCancel,
}) => {
  const draftText = useAddTextReviewDraftStore((s) => s.draftsByPlaceId[placeId] ?? '');
  const setDraft = useAddTextReviewDraftStore((s) => s.setDraft);
  const clearDraft = useAddTextReviewDraftStore((s) => s.clearDraft);
  const [text, setText] = useState(initialValue || draftText || '');
  const [error, setError] = useState<string | null>(null);
  const [imagesError, setImagesError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { user } = useAuthStore();

  const [addTextReview, { loading, error: apolloError }] = useAddTextReviewMutation({
    refetchQueries: [
      {
        query: PlaceReviewsDocument,
        variables: { placeId },
      },
    ],
    awaitRefetchQueries: true,
  });

  const [uploadReviewImages, { loading: isUploadingImages }] = useUploadReviewImagesMutation();

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Clear local error when Apollo error changes
  useEffect(() => {
    if (apolloError) {
      const errorMessage = apolloError.message || 'Failed to submit review. Please try again.';
      setError(errorMessage);
    }
  }, [apolloError]);

  const debouncedSetDraft = useMemo(
    () =>
      debounce((value: string) => {
        setDraft(placeId, value);
      }, 800),
    [placeId, setDraft],
  );

  useEffect(() => {
    // If editing existing review, prefer initialValue; otherwise, load draft
    setText(initialValue || draftText || '');
  }, [initialValue, draftText]);

  useEffect(() => {
    if (!initialValue || !textareaRef.current) return;
    // Focus and move caret to end only when editing existing text
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.focus();
      const len = el.value.length;
      try {
        el.setSelectionRange(len, len);
      } catch {}
    });
  }, [initialValue]);

  useEffect(() => {
    return () => {
      debouncedSetDraft.cancel();
    };
  }, [debouncedSetDraft]);

  const MAX_FILES = 10;
  const MAX_SIZE_BYTES = 5 * 1024 * 1024;
  const ACCEPTED_MIME = ['image/jpeg', 'image/png'];

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

  const handleFileChange = (incoming: FileList | null) => {
    if (!incoming) return;
    const next: File[] = [];
    for (let i = 0; i < incoming.length; i++) {
      const f = incoming.item(i);
      if (!f) continue;
      if (!ACCEPTED_MIME.includes(f.type)) {
        setImagesError('Only JPEG and PNG files are allowed');
        return;
      }
      if (f.size > MAX_SIZE_BYTES) {
        setImagesError('Each file must be under 5MB');
        return;
      }
      next.push(f);
      if (next.length >= MAX_FILES) break;
    }
    if (next.length === 0) return;
    setImagesError(null);
    setFiles((prev) => [...prev, ...next].slice(0, MAX_FILES));
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = text.trim();
      if (!trimmed) return;

      // Clear previous error
      setError(null);

      try {
        if (!user) {
          showLoginRequired();
          return;
        }
        await addTextReview({ variables: { placeId, text: trimmed } });

        // Upload images after text review submission
        if (files.length > 0) {
          try {
            const base64s = await Promise.all(files.map(toBase64));
            await uploadReviewImages({ variables: { placeId, images: base64s } });
          } catch (imgErr) {
            // keep review, just report image upload error
            setImagesError(imgErr instanceof Error ? imgErr.message : 'Failed to upload images');
          }
        }
        // Only clear text and draft if the operation was successful
        clearDraft(placeId);
        setFiles([]);
        onSubmitted?.();
      } catch (err) {
        // Apollo errors are handled by useEffect, this is for other errors
        const errorMessage = err instanceof Error ? err.message : 'Failed to submit review. Please try again.';
        setError(errorMessage);
        console.error('Error adding or updating review:', err);
      }
    },
    [text, user, addTextReview, placeId, clearDraft, onSubmitted, files, uploadReviewImages],
  );
  return (
    <form className={clsx(cls.container, className)} onSubmit={handleSubmit}>
      <textarea
        disabled={loading}
        ref={textareaRef}
        className={cls.textarea}
        value={text}
        onChange={(e) => {
          const next = e.target.value;
          setText(next);
          // Clear error when user starts typing
          if (error) {
            setError(null);
          }
          if (!initialValue) {
            debouncedSetDraft(next);
          }
        }}
        maxLength={1000}
        placeholder={initialValue ? 'Edit your review...' : 'Write your review...'}
        rows={4}
      />
      <div className={cls.actions}>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_MIME.join(',')}
          multiple
          className={cls.hiddenInput}
          onChange={(e) => {
            handleFileChange(e.target.files);
          }}
        />
        <RegularButton variant="ghost" theme="neutral" type="button" onClick={() => fileInputRef.current?.click()}>
          Attach images
        </RegularButton>
        <span className={cls.hint}>
          {files.length}/{MAX_FILES} selected • JPEG/PNG up to 5MB
        </span>
      </div>
      {imagesError && <div className={cls.error}>{imagesError}</div>}
      {error && <div className={cls.error}>{error}</div>}
      <div className={cls.actions}>
        {initialValue && (
          <RegularButton
            variant="ghost"
            theme="neutral"
            type="button"
            onClick={() => {
              onCancel?.();
            }}
          >
            Cancel
          </RegularButton>
        )}
        <RegularButton
          type="submit"
          variant="solid"
          disabled={loading || isUploadingImages || text.trim().length === 0}
        >
          {loading || isUploadingImages ? 'Sending review ...' : initialValue ? 'Update review' : 'Submit review'}
        </RegularButton>
      </div>
    </form>
  );
};

export const AddTextReviewForm = memo(AddTextReviewFormComponent, (prevProps, nextProps) => {
  return prevProps.placeId === nextProps.placeId;
});
