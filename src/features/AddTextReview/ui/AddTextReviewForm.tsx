import clsx from 'clsx';
import { debounce } from 'lodash-es';
import React, { useCallback, useEffect, useMemo, useRef, useState, memo } from 'react';
import { client } from 'shared/config/apolloClient';
import { useAddTextReviewMutation, PlaceReviewsDocument } from 'shared/generated/graphql';
import { useAuthStore } from 'shared/stores/auth';
import { showLoginRequired } from 'shared/stores/modal';
import { RegularButton } from 'shared/ui/RegularButton';
import { UploadReviewImages } from '../components/UploadReviewImages/ui/UploadReviewImages';
import { useAddTextReviewDraftStore } from '../model';
import { type ImagesWrapper, type AddTextReviewFormProps } from '../types';
import { handleImgUpload } from '../utils/handleImgUpload';
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
  const [imagesWrappers, setImagesWrappers] = useState<ImagesWrapper[]>([]);
  const [isImgUploadingProcessing] = useState(false);

  const { user } = useAuthStore();

  const [addTextReview, { loading, error: apolloError }] = useAddTextReviewMutation({
    awaitRefetchQueries: true,
  });

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

        const result = await addTextReview({
          variables: { placeId, text: trimmed, reviewImages: imagesWrappers.length },
        });
        const reviewId = result.data?.addTextReview?.reviewId;
        if (reviewId && imagesWrappers.length > 0) {
          await handleImgUpload(imagesWrappers, placeId, reviewId, setImagesWrappers);
          console.log('completed');
        }

        clearDraft(placeId);
        onSubmitted?.();

        await client.refetchQueries({
          include: [PlaceReviewsDocument],
        });
      } catch (err) {
        // Apollo errors are handled by useEffect, this is for other errors
        const errorMessage = err instanceof Error ? err.message : 'Failed to submit review. Please try again.';
        setError(errorMessage);
        console.error('Error adding or updating review:', err);
      }
    },
    [text, user, imagesWrappers, addTextReview, placeId, clearDraft, onSubmitted],
  );
  // Generate unique IDs for accessibility
  const textareaId = `review-text-${placeId}`;
  const errorId = `review-error-${placeId}`;
  const imagesId = `review-images-${placeId}`;

  return (
    <form className={clsx(cls.container, className)} onSubmit={handleSubmit}>
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
            aria-describedby={`${errorId} ${imagesId}`}
            aria-required="true"
            aria-invalid={error ? 'true' : 'false'}
          />
          <div className={cls.bottomArea}>
            <UploadReviewImages
              imagesWrappers={imagesWrappers}
              setImagesWrappers={setImagesWrappers}
              isProcessing={isImgUploadingProcessing}
            />

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
            disabled={loading || text.trim().length === 0}
            aria-describedby={loading || isImgUploadingProcessing ? 'loading-status' : undefined}
          >
            {loading || isImgUploadingProcessing
              ? 'Sending review ...'
              : initialValue
                ? 'Update review'
                : 'Submit review'}
          </RegularButton>
        </div>

        {(loading || isImgUploadingProcessing) && (
          <div id="loading-status" className="sr-only" aria-live="polite">
            {loading ? 'Submitting review...' : 'Processing images...'}
          </div>
        )}
      </fieldset>
    </form>
  );
};

export const AddTextReviewForm = memo(AddTextReviewFormComponent, (prevProps, nextProps) => {
  return prevProps.placeId === nextProps.placeId;
});
