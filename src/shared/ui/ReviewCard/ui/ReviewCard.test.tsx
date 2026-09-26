import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ReviewCard } from './ReviewCard';

const renderCard = (props: Partial<React.ComponentProps<typeof ReviewCard>> = {}) =>
  render(
    <ReviewCard
      placeId="place-1"
      reviewId="review-1"
      userName="Anonymous User"
      reviewImages={0}
      createdAt={new Date().toISOString()}
      isGoogleReview={false}
      {...props}
    />,
  );

describe('ReviewCard', () => {
  it('shows a Review with Photos but no Review text as its Rating and Photos', () => {
    const { container } = renderCard({ rating: 4, reviewImages: 2 });

    expect(screen.getByText('Rated: 4')).toBeInTheDocument();
    expect(container.querySelectorAll('img[src*="review-images"]')).toHaveLength(2);
  });

  it('shows nothing for a Rating alone', () => {
    const { container } = renderCard({ rating: 4 });

    expect(container).toBeEmptyDOMElement();
  });
});
