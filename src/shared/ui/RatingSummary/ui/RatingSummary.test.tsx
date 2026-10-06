import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { RatingSummary } from './RatingSummary';

describe('RatingSummary', () => {
  it('shows the Average rating and how many Ratings it comes from', () => {
    render(<RatingSummary averageRating={4.8} ratingCount={5} />);

    expect(screen.getByText('4.8')).toBeInTheDocument();
    expect(screen.getByText('(5 ratings)')).toBeInTheDocument();
  });

  it('shows a whole Average rating with one decimal', () => {
    render(<RatingSummary averageRating={4} ratingCount={2} />);

    expect(screen.getByText('4.0')).toBeInTheDocument();
  });

  it('reads "1 rating" for a single Rating', () => {
    render(<RatingSummary averageRating={5} ratingCount={1} />);

    expect(screen.getByText('(1 rating)')).toBeInTheDocument();
  });

  it('says the Place is unrated instead of showing a number when there are no Ratings', () => {
    const { container } = render(<RatingSummary averageRating={null} ratingCount={0} />);

    expect(screen.getByText('No ratings yet — be the first')).toBeInTheDocument();
    expect(container).not.toHaveTextContent(/\d/);
  });

  it('is display-only: no radios and nothing to focus', async () => {
    const user = userEvent.setup();
    const { container } = render(<RatingSummary averageRating={3.5} ratingCount={4} size="small" />);

    expect(screen.queryByRole('radio')).not.toBeInTheDocument();
    expect(container.querySelector('[tabindex]')).toBeNull();
    await user.tab();
    expect(document.body).toHaveFocus();
  });
});
