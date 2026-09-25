import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useShowsRateBlock } from './useShowsRateBlock';

type Props = Parameters<typeof useShowsRateBlock>[0];

const renderShowsRateBlock = (initialProps: Props) =>
  renderHook((props: Props) => useShowsRateBlock(props), { initialProps });

describe('useShowsRateBlock', () => {
  it('waits for the Reviews of the Place', () => {
    const { result, rerender } = renderShowsRateBlock({
      placeId: 'a',
      hasReviews: false,
      hasReviewsError: false,
    });
    expect(result.current).toBe(false);

    rerender({ placeId: 'a', hasReviews: true, hasReviewsError: false });
    expect(result.current).toBe(true);
  });

  it('keeps showing while the same Place’s Reviews are fetched again', () => {
    const { result, rerender } = renderShowsRateBlock({
      placeId: 'a',
      hasReviews: true,
      hasReviewsError: false,
    });

    rerender({ placeId: 'a', hasReviews: false, hasReviewsError: false });

    expect(result.current).toBe(true);
  });

  it('waits again for the Reviews of the next Place', () => {
    const { result, rerender } = renderShowsRateBlock({
      placeId: 'a',
      hasReviews: true,
      hasReviewsError: false,
    });

    rerender({ placeId: 'b', hasReviews: false, hasReviewsError: false });
    expect(result.current).toBe(false);

    rerender({ placeId: 'b', hasReviews: true, hasReviewsError: false });
    expect(result.current).toBe(true);
  });

  it('shows when the Reviews fail to load', () => {
    const { result } = renderShowsRateBlock({ placeId: 'a', hasReviews: false, hasReviewsError: true });

    expect(result.current).toBe(true);
  });
});
