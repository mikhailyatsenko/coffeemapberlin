import { MockedProvider } from '@apollo/client/testing';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ReviewsBlock } from './ReviewsBlock';

const renderBlock = (props: Partial<React.ComponentProps<typeof ReviewsBlock>> = {}) =>
  render(
    <MockedProvider mocks={[]}>
      <ReviewsBlock
        placeId="place-1"
        isEditingReview={false}
        ownReviewHasText={false}
        ownReviewPhotoCount={0}
        editInitialText=""
        displayedReviews={[]}
        onSubmitted={() => {}}
        onCancel={() => {}}
        onEditReview={() => {}}
        {...props}
      />
    </MockedProvider>,
  );

describe('ReviewsBlock with no Reviews', () => {
  it('"write one" focuses the Review text field', () => {
    renderBlock();

    fireEvent.click(screen.getByRole('button', { name: 'write one' }));

    expect(screen.getByLabelText(/Write your review/)).toHaveFocus();
  });

  it('hides the prompt when there is no form to go to', () => {
    renderBlock({ ownReviewHasText: true });

    expect(screen.getByText('There are no reviews yet.')).toBeInTheDocument();
    expect(screen.queryByText(/Be first to/)).not.toBeInTheDocument();
  });
});
