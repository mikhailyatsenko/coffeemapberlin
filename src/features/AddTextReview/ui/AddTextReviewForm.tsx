import clsx from 'clsx';
import { debounce } from 'lodash-es';
import React, { useCallback, useEffect, useMemo, useRef, useState, memo } from 'react';
import toast from 'react-hot-toast';
import { client } from 'shared/config/apolloClient';
import { useAddTextReviewMutation, PlaceReviewsDocument } from 'shared/generated/graphql';
import { ensureGuestIdentity, type GuestIdentity } from 'shared/lib/guest';
import { useAuthStore } from 'shared/stores/auth';
import { showGuestReviewSubmitted } from 'shared/stores/modal';
import { RegularButton } from 'shared/ui/RegularButton';
import { UploadReviewImages } from '../components/UploadReviewImages/ui/UploadReviewImages';
import { useAddTextReviewDraftStore } from '../model';
import { type ImagesWrapper, type AddTextReviewFormProps } from '../types';
import { uploadReviewImages } from '../utils/uploadReviewImages';
import cls from './AddTextReviewForm.module.scss';

const AddTextReviewFormComponent: React.FC<AddTextReviewFormProps> = ({
  placeId,
  initialValue = '',
  className,
  onSubmitted,
  onCancel,
  ...props
}) => {
  const draftText = useAddTextReviewDraftStore((s) => s.draftsByPlaceId[placeId] ?? '');
  const setDraft = useAddTextReviewDraftStore((s) => s.setDraft);
  const clearDraft = useAddTextReviewDraftStore((s) => s.clearDraft);
  const [text, setText] = useState(initialValue || draftText || '');
  const [error, setError] = useState<string | null>(null);
  const [imagesWrappers, setImagesWrappers] = useState<ImagesWrapper[]>([]);
  const [isImgUploadingProcessing, setIsImgUploadingProcessing] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { user } = useAuthStore();

  const [addTextReview, { loading: isAddTextLoading, error: apolloError }] = useAddTextReviewMutation({
    awaitRefetchQueries: true,
  });

  // Combined loading state for better UX
  const isFormLoading = isAddTextLoading || isImgUploadingProcessing;

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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up image URLs to prevent memory leaks
      imagesWrappers.forEach((img) => {
        if (img.localUrl) {
          URL.revokeObjectURL(img.localUrl);
        }
      });
    };
  }, [imagesWrappers]);

  const overallUploadProgress = useMemo(() => {
    return Math.round(imagesWrappers.reduce((acc, img) => acc + img.progress, 0) / imagesWrappers.length);
  }, [imagesWrappers]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = text.trim();
      if (!trimmed) return;

      if (isFormLoading) return;

      setError(null);

      abortControllerRef.current = new AbortController();

      try {
        // Guests review under an identity issued after a captcha check; the
        // captcha runs here, on the first guest action, not on every submit.
        const guestCredentials: Partial<GuestIdentity> = user ? {} : await ensureGuestIdentity();

        const result = await addTextReview({
          variables: { placeId, text: trimmed, ...guestCredentials },
          context: {
            fetchOptions: {
              signal: abortControllerRef.current.signal,
            },
          },
        });

        const reviewId = result.data?.addTextReview?.reviewId;

        if (reviewId && imagesWrappers.length > 0) {
          try {
            await uploadReviewImages(
              imagesWrappers,
              reviewId,
              guestCredentials,
              setImagesWrappers,
              setIsImgUploadingProcessing,
              abortControllerRef.current.signal,
            );
          } catch (uploadError) {
            // The review itself is saved and consistent — it simply has fewer
            // photos than intended, so it is left in place either way.
            setIsImgUploadingProcessing(false);

            if (!(uploadError instanceof Error && uploadError.name === 'AbortError')) {
              console.error('Image upload failed:', uploadError);
              toast.error('Some photos could not be uploaded');
            }
          }
        }

        clearDraft(placeId);
        onSubmitted?.();

        await client.refetchQueries({
          include: [PlaceReviewsDocument],
        });

        if (!user) {
          showGuestReviewSubmitted();
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }

        const errorMessage = err instanceof Error ? err.message : 'Failed to submit review. Please try again.';
        setError(errorMessage);
        console.error('Error adding or updating review:', err);
      } finally {
        abortControllerRef.current = null;
      }
    },
    [text, isFormLoading, user, addTextReview, placeId, imagesWrappers, clearDraft, onSubmitted],
  );

  const handleCancelSubmission = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsImgUploadingProcessing(false);
      toast.error('Submission cancelled by user');
    }
  }, []);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);
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
            <UploadReviewImages
              imagesWrappers={imagesWrappers}
              setImagesWrappers={setImagesWrappers}
              isProcessing={isFormLoading}
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
              onClick={handleCancelSubmission}
              aria-label="Cancel submission and image upload"
            >
              Cancel Upload
            </RegularButton>
          )}
          <RegularButton
            type="submit"
            variant="solid"
            disabled={isFormLoading || text.trim().length === 0}
            aria-describedby={isFormLoading ? 'loading-status' : undefined}
          >
            {isAddTextLoading
              ? 'Sending review ...'
              : isImgUploadingProcessing
                ? `Uploading images... ${overallUploadProgress}%`
                : initialValue
                  ? 'Update review'
                  : 'Submit review'}
          </RegularButton>
        </div>

        {isFormLoading && (
          <div id="loading-status" className="sr-only" aria-live="polite">
            {isAddTextLoading ? 'Submitting review...' : `Processing images... ${overallUploadProgress}%`}
          </div>
        )}
      </fieldset>
    </form>
  );
};

export const AddTextReviewForm = memo(AddTextReviewFormComponent, (prevProps, nextProps) => {
  return prevProps.placeId === nextProps.placeId;
});
