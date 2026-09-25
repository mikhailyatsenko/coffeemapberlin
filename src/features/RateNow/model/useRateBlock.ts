import { useCallback, useEffect, useRef, useState } from 'react';
import { type Characteristic } from 'shared/generated/graphql';
import { trackEvent } from 'shared/lib/analytics';
import { useAuthStore } from 'shared/stores/auth';

import { useOnFirstView } from '../hooks/useOnFirstView';
import { getActor } from '../lib/getActor';
import { getRemainingQuestions } from '../lib/getRemainingQuestions';
import { type RateBlockProps } from '../types';

/**
 * The block's states: beans while there is no Rating or the person is changing it,
 * otherwise the thank-you with the Rating. A tap shows the thank-you at once; a failed
 * save brings the beans back. Once a Rating exists and no questions remain, a person
 * without Review text is offered the Review text form.
 */
export const useRateBlock = ({
  placeId,
  rating,
  characteristicCounts,
  hasReviewText,
  onAddReviewText,
}: RateBlockProps) => {
  const user = useAuthStore((s) => s.user);
  // The Rating tapped in this page view, shown before the caller's Rating catches up.
  const [tappedRating, setTappedRating] = useState<number | null>(null);
  const [ratingFromCaller, setRatingFromCaller] = useState(rating);
  if (rating !== ratingFromCaller) {
    setRatingFromCaller(rating);
    setTappedRating(null);
  }
  const [isChanging, setIsChanging] = useState(false);
  const [isThanked, setIsThanked] = useState(false);
  // Not asked again in this page view: skipped, or removed from "Your marks". Kept here so it outlives a failed Rating.
  const [dismissed, setDismissed] = useState<Characteristic[]>([]);
  // Toggles still saving, from a Yes or a removed mark. Neither the questions nor "Your marks" offer them
  // meanwhile, so a second toggle can't undo the first.
  const [saving, setSaving] = useState<Characteristic[]>([]);
  const beansRef = useRef<HTMLDivElement>(null);
  const changeButtonRef = useRef<HTMLButtonElement>(null);
  // Set by the person's own action, so the block never takes focus on its first render.
  const shouldMoveFocusRef = useRef(false);

  const currentRating = tappedRating ?? rating ?? null;
  const showsBeans = isChanging || currentRating === null;
  const offersReviewText =
    currentRating !== null && !hasReviewText && getRemainingQuestions(characteristicCounts, dismissed).length === 0;

  const blockRef = useOnFirstView<HTMLElement>(() => {
    trackEvent('rate_block_view', {
      place_id: placeId,
      actor: getActor(user),
      has_rating: currentRating !== null,
    });
  });

  // Focuses the start of the block: the beans, or "change" next to the Rating.
  const focusRating = useCallback(() => {
    if (showsBeans) {
      beansRef.current?.querySelector<HTMLElement>('[role="radio"][tabindex="0"]')?.focus();
    } else {
      changeButtonRef.current?.focus();
    }
  }, [showsBeans]);

  // The focused element was just hidden, so focus moves to what replaced it.
  useEffect(() => {
    if (!shouldMoveFocusRef.current) return;
    shouldMoveFocusRef.current = false;
    focusRating();
  }, [focusRating]);

  const handleRate = (newRating: number) => {
    shouldMoveFocusRef.current = true;
    setTappedRating(newRating);
    setIsThanked(true);
    setIsChanging(false);
  };

  const handleSaveFailed = () => {
    shouldMoveFocusRef.current = true;
    setTappedRating(null);
    setIsThanked(false);
    setIsChanging(true);
  };

  const startChange = () => {
    shouldMoveFocusRef.current = true;
    setIsChanging(true);
  };

  const dismiss = (characteristic: Characteristic) => {
    setDismissed((current) => [...current, characteristic]);
  };

  const whileSaving = async (characteristic: Characteristic, save: () => Promise<void>) => {
    setSaving((current) => [...current, characteristic]);
    try {
      await save();
    } finally {
      setSaving((current) => current.filter((c) => c !== characteristic));
    }
  };

  const addReviewText = () => {
    trackEvent('review_text_link_click', { place_id: placeId, actor: getActor(user) });
    onAddReviewText();
  };

  return {
    blockRef,
    beansRef,
    changeButtonRef,
    currentRating,
    showsBeans,
    isThanked,
    handleRate,
    handleSaveFailed,
    startChange,
    dismissed,
    dismiss,
    saving,
    whileSaving,
    focusRating,
    offersReviewText,
    addReviewText,
  };
};
