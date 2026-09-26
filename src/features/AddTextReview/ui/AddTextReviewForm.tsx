import clsx from 'clsx';
import { debounce } from 'lodash-es';
import React, { useEffect, useMemo, useRef, useState, memo } from 'react';
import { isUploadable, usePhotoUpload } from 'shared/lib/photoUpload';
import { RegularButton } from 'shared/ui/RegularButton';
import { ReviewPhotoPicker } from '../components/ReviewPhotoPicker';
import { useAddTextReviewDraftStore, useSubmitReview } from '../model';
import { type AddTextReviewFormProps } from '../types';
import cls from './AddTextReviewForm.module.scss';

const AddTextReviewFormComponent: React.FC<AddTextReviewFormProps> = ({
  placeId,
  initialValue = '',
  existingPhotoCount = 0,
  className,
  onSubmitted,
  onCancel,
  ...props
}) => {
  const draftText = useAddTextReviewDraftStore((s) => s.draftsByPlaceId[placeId] ?? '');
  const setDraft = useAddTextReviewDraftStore((s) => s.setDraft);
  const [text, setText] = useState(initialValue || draftText || '');
  const photoUpload = usePhotoUpload(existingPhotoCount);
  const { photos, isUploading: isUploadingPhotos } = photoUpload;
  const { submit, cancel, isSavingText, error, setError } = useSubmitReview({
    placeId,
    uploadPhotos: photoUpload.uploadPending,
    onSubmitted,
  });

  // Combined loading state for better UX
  const isFormLoading = isSavingText || isUploadingPhotos;
  // Also waits for picked Photos to finish downscaling.
  const isBusy = isFormLoading || photoUpload.isPreparing;

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

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

  const overallUploadProgress = useMemo(() => {
    const uploadable = photos.filter(isUploadable);
    const saved = uploadable.filter((photo) => photo.status === 'saved');
    return uploadable.length ? Math.round((saved.length / uploadable.length) * 100) : 0;
  }, [photos]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    // Photos still downscaling would miss the upload.
    if (!trimmed || isBusy) return;
    void submit(trimmed);
  };

  // Generate unique IDs for accessibility
  const textareaId = `review-text-${placeId}`;
  const errorId = `review-error-${placeId}`;
  const imagesId = `review-images-${placeId}`;

  return (
    <form className={clsx(cls.container, className)} onSubmit={handleSubmit} {...props}>
      <fieldset>
        <legend className="sr-only">Review Form</legend>

        <div className={cls.textareaContainer}>
          <label htmlFor={textareaId} className={cls.textareaLabel}>
            {initialValue ? 'Edit your review' : 'Write your review'}
            <span className={cls.required} aria-label="required">
              *
            </span>
          </label>
          <textarea
            id={textareaId}
            disabled={isFormLoading}
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
            aria-describedby={`${errorId} ${imagesId}`}
            aria-required="true"
            aria-invalid={error ? 'true' : 'false'}
          />
          <div className={cls.bottomArea}>
            <ReviewPhotoPicker photoUpload={photoUpload} isProcessing={isBusy} />

            <div className={cls.characterCount}>{text.length}/1000 characters</div>
          </div>
        </div>

        {error && (
          <div id={errorId} className={cls.error} role="alert" aria-live="polite">
            {error}
          </div>
        )}

        <div className={cls.actions}>
          {initialValue && (
            <RegularButton
              variant="ghost"
              theme="neutral"
              type="button"
              disabled={isFormLoading}
              onClick={() => {
                onCancel?.();
              }}
            >
              Cancel
            </RegularButton>
          )}
          {isFormLoading && (
            <RegularButton
              variant="outline"
              theme="error"
              type="button"
              onClick={cancel}
              aria-label="Cancel submission and image upload"
            >
              Cancel Upload
            </RegularButton>
          )}
          <RegularButton
            type="submit"
            variant="solid"
            disabled={isBusy || text.trim().length === 0}
            aria-describedby={isFormLoading ? 'loading-status' : undefined}
          >
            {isSavingText
              ? 'Sending review ...'
              : isUploadingPhotos
                ? `Uploading images... ${overallUploadProgress}%`
                : initialValue
                  ? 'Update review'
                  : 'Submit review'}
          </RegularButton>
        </div>

        {isFormLoading && (
          <div id="loading-status" className="sr-only" aria-live="polite">
            {isSavingText ? 'Submitting review...' : `Processing images... ${overallUploadProgress}%`}
          </div>
        )}
      </fieldset>
    </form>
  );
};

export const AddTextReviewForm = memo(AddTextReviewFormComponent, (prevProps, nextProps) => {
  return prevProps.placeId === nextProps.placeId && prevProps.existingPhotoCount === nextProps.existingPhotoCount;
});
