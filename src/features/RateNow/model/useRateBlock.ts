import { useEffect, useRef, useState } from 'react';
import { trackEvent } from 'shared/lib/analytics';
import { useAuthStore } from 'shared/stores/auth';

import { useOnFirstView } from '../hooks/useOnFirstView';
import { getActor } from '../lib/getActor';
import { type RateBlockProps } from '../types';

/**
 * The block's states: beans while there is no Rating or the person is changing it,
 * otherwise the thank-you with the Rating. A tap shows the thank-you at once; a failed
 * save brings the beans back.
 */
export const useRateBlock = ({ placeId, rating }: Pick<RateBlockProps, 'placeId' | 'rating'>) => {
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
  const beansRef = useRef<HTMLDivElement>(null);
  const changeButtonRef = useRef<HTMLButtonElement>(null);
  // Set by the person's own action, so the block never takes focus on its first render.
  const shouldMoveFocusRef = useRef(false);

  const currentRating = tappedRating ?? rating ?? null;
  const showsBeans = isChanging || currentRating === null;

  const blockRef = useOnFirstView<HTMLElement>(() => {
    trackEvent('rate_block_view', {
      place_id: placeId,
      actor: getActor(user),
      has_rating: currentRating !== null,
    });
  });

  // The focused element was just hidden, so focus moves to what replaced it.
  useEffect(() => {
    if (!shouldMoveFocusRef.current) return;
    shouldMoveFocusRef.current = false;
    if (showsBeans) {
      beansRef.current?.querySelector<HTMLElement>('[role="radio"][tabindex="0"]')?.focus();
    } else {
      changeButtonRef.current?.focus();
    }
  }, [showsBeans]);

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
  };
};
