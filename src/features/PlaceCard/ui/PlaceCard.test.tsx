import { render, screen } from '@testing-library/react';
import { type ComponentProps } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { PlaceCard } from './PlaceCard';

// The favorite button owns its own data access; the rating row doesn't depend on it.
vi.mock('shared/ui/AddToFavButton', () => ({ AddToFavButton: () => null }));

type Properties = ComponentProps<typeof PlaceCard>['properties'];

const properties = (averageRating: number | null, ratingCount: number): Properties => ({
  __typename: 'PlaceProperties',
  id: 'a',
  name: 'Place a',
  description: '',
  address: '',
  image: '',
  instagram: '',
  averageRating,
  ratingCount,
  isFavorite: false,
  neighborhood: 'Mitte',
  googleId: null,
});

const renderCard = (averageRating: number | null, ratingCount: number) =>
  render(
    <MemoryRouter>
      <PlaceCard properties={properties(averageRating, ratingCount)} coordinates={[13.4, 52.5]} index={0} />
    </MemoryRouter>,
  );

describe('PlaceCard', () => {
  it('shows the Average rating and how many Ratings it comes from', () => {
    renderCard(4, 6);

    expect(screen.getByText('4.0')).toBeInTheDocument();
    expect(screen.getByText('(6 ratings)')).toBeInTheDocument();
  });

  it('says an unrated Place has no Ratings yet', () => {
    renderCard(null, 0);

    expect(screen.getByText('No ratings yet — be the first')).toBeInTheDocument();
  });
});
