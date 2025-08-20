import clsx from 'clsx';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAddTextReview } from 'shared/api';
import { RegularButton } from 'shared/ui/RegularButton';
import { type AddTextReviewFormProps } from '../types';
import cls from './AddTextReviewForm.module.scss';

export const AddTextReviewForm: React.FC<AddTextReviewFormProps> = ({
  placeId,
  initialValue = '',
  className,
  onSubmitted,
  onCancel,
}) => {
  const [text, setText] = useState(initialValue);
  const { handleAddTextReview, loading } = useAddTextReview(placeId);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    setText(initialValue || '');
  }, [initialValue]);

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

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = text.trim();
      if (!trimmed) return;
      try {
        await handleAddTextReview(trimmed);
        setText('');
        onSubmitted?.();
      } catch (e) {
        // error already handled in hook
      }
    },
    [text, handleAddTextReview, onSubmitted],
  );

  return (
    <form className={clsx(cls.container, className)} onSubmit={handleSubmit}>
      <textarea
        ref={textareaRef}
        className={cls.textarea}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
        }}
        maxLength={1000}
        placeholder={initialValue ? 'Edit your review...' : 'Write your review...'}
        rows={4}
      />
      <div className={cls.actions}>
        {initialValue && (
          <RegularButton
            theme="blank"
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
