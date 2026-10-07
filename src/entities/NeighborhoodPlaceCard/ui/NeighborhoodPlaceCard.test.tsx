import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { type NeighborhoodPlaceCardProps } from '../types';
import { NeighborhoodPlaceCard } from './NeighborhoodPlaceCard';

// The favorite button owns its own data access; the rating count doesn't depend on it.
vi.mock('shared/ui/AddToFavButton', () => ({ AddToFavButton: () => null }));

const place = (ratingCount: number): NeighborhoodPlaceCardProps['place'] => ({
  __typename: 'Place',
  id: 'a',
  type: 'Feature',
  geometry: { __typename: 'Geometry', type: 'Point', coordinates: [13.4, 52.5] },
  properties: {
    __typename: 'PlaceProperties',
    id: 'a',
    name: 'Place a',
    description: '',
    address: '',
    image: '',
    instagram: '',
    averageRating: 4.2,
    ratingCount,
    favoriteCount: 0,
    isFavorite: false,
    ownRating: null,
    googleId: null,
    neighborhood: 'Mitte',
    shortlistIds: [],
  },
});

const renderCard = (ratingCount: number) =>
  render(
    <MemoryRouter>
      <NeighborhoodPlaceCard place={place(ratingCount)} />
    </MemoryRouter>,
  );

describe('NeighborhoodPlaceCard', () => {
  it('reads "1 rating" for a Place with one Rating', () => {
    renderCard(1);

    expect(screen.getByText('(1 rating)')).toBeInTheDocument();
  });

  it('reads "N ratings" for a Place with several Ratings', () => {
    renderCard(3);

    expect(screen.getByText('(3 ratings)')).toBeInTheDocument();
  });
});
