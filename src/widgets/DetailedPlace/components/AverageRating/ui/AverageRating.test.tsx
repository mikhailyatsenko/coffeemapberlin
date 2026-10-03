import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AverageRating } from './AverageRating';

describe('AverageRating', () => {
  it('reads "from 1 rating" for a Place with one Rating', () => {
    render(<AverageRating averageRating={4} ratingCount={1} />);

    expect(screen.getByText('from 1 rating')).toBeInTheDocument();
  });

  it('reads "from N ratings" for a Place with several Ratings', () => {
    render(<AverageRating averageRating={4} ratingCount={5} />);

    expect(screen.getByText('from 5 ratings')).toBeInTheDocument();
  });

  it('shows no count for a Place without Ratings', () => {
    const { container } = render(<AverageRating averageRating={0} ratingCount={0} />);

    expect(container).toHaveTextContent(/^This place has not been rated yet0\/5$/);
  });
});
