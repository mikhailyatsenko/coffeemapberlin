import clsx from 'clsx';
import { debounce } from 'lodash-es';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAddTextReview } from 'shared/api';
import { RegularButton } from 'shared/ui/RegularButton';
import { useAddTextReviewDraftStore } from '../model';
import { type AddTextReviewFormProps } from '../types';
import cls from './AddTextReviewForm.module.scss';

export const AddTextReviewForm: React.FC<AddTextReviewFormProps> = ({
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
  const { handleAddTextReview, loading } = useAddTextReview(placeId);
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

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = text.trim();
      if (!trimmed) return;
      try {
        debouncedSetDraft.flush?.();
        await handleAddTextReview(trimmed);
        setText('');
        clearDraft(placeId);
        onSubmitted?.();
      } catch (e) {
        // error already handled in hook
      }
    },
    [text, handleAddTextReview, onSubmitted, placeId, clearDraft, debouncedSetDraft],
  );

  return (
    <form className={clsx(cls.container, className)} onSubmit={handleSubmit}>
      <textarea
        ref={textareaRef}
        className={cls.textarea}
        value={text}
        onChange={(e) => {
          const next = e.target.value;
          setText(next);
          if (!initialValue) {
            debouncedSetDraft(next);
          }
        }}
        maxLength={1000}
        placeholder={initialValue ? 'Edit your review...' : 'Write your review...'}
        rows={4}
      />
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
        <RegularButton type="submit" disabled={loading || text.trim().length === 0}>
          {initialValue ? 'Update review' : 'Submit review'}
        </RegularButton>
      </div>
    </form>
  );
};
