import { MockedProvider, type MockedResponse } from '@apollo/client/testing';
import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FilteredPlacesDocument, type FilteredPlacesQuery } from 'shared/generated/graphql';
import { trackEvent } from 'shared/lib/analytics';
import { setUser } from 'shared/stores/auth';
import { NeighborhoodPage } from './NeighborhoodPage';

vi.mock('shared/lib/analytics', () => ({ trackEvent: vi.fn() }));

type Place = FilteredPlacesQuery['filteredPlaces']['places'][number];

const place = (id: string, averageRating: number, ratingCount: number): Place => ({
  __typename: 'Place',
  id,
  type: 'Feature',
  geometry: { __typename: 'Geometry', type: 'Point', coordinates: [13.4, 52.5] },
  properties: {
    __typename: 'PlaceProperties',
    id,
    name: `Place ${id}`,
    description: '',
    address: '',
    image: '',
    instagram: '',
    averageRating,
    ratingCount,
    favoriteCount: 0,
    isFavorite: false,
    googleId: null,
    neighborhood: 'Mitte',
  },
});

const filteredPlacesMock = (variables: Record<string, unknown>, places: Place[]): MockedResponse => ({
  request: { query: FilteredPlacesDocument, variables },
  result: {
    data: { filteredPlaces: { __typename: 'FilteredPlacesResult', places, total: places.length } },
  },
});

const renderPage = ({
  topRated,
  all,
  slug = 'mitte',
  path = `/neighborhood/${slug}`,
}: {
  topRated: Place[];
  all: Place[];
  slug?: string;
  path?: string;
}) =>
  render(
    <MockedProvider
      mocks={[
        filteredPlacesMock({ neighborhood: slug, minRating: 4.5 }, topRated),
        filteredPlacesMock({ neighborhood: slug }, all),
      ]}
    >
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/" element={<p>Map</p>} />
          <Route path="/neighborhood/:neighborhood" element={<NeighborhoodPage notFound={<p>Not found</p>} />} />
          <Route path="/neighborhood" element={<NeighborhoodPage notFound={<p>Not found</p>} />} />
          <Route path="/place/:id" element={<p>Place page</p>} />
        </Routes>
      </MemoryRouter>
    </MockedProvider>,
  );

const trackedEvents = (name: string) => vi.mocked(trackEvent).mock.calls.filter(([eventName]) => eventName === name);

const section = (name: RegExp) => screen.getByRole('region', { name });
const cardNames = (region: HTMLElement) =>
  within(region)
    .getAllByRole('heading', { level: 3 })
    .map((heading) => heading.textContent);

describe('NeighborhoodPage', () => {
  beforeEach(() => {
    setUser(null);
  });

  afterEach(() => {
    vi.mocked(trackEvent).mockClear();
  });

  it('shows Top rated first and then every Place in the Neighborhood', async () => {
    const great = place('a', 4.8, 10);
    const good = place('b', 4.1, 3);
    renderPage({ topRated: [great], all: [good, great] });

    expect(await screen.findByRole('heading', { level: 1, name: 'Best Coffee Places in Mitte' })).toBeInTheDocument();
    const topRated = await screen.findByRole('region', { name: /top rated/i });
    const all = section(/all 2 places in mitte/i);
    expect(cardNames(topRated)).toEqual(['Place a']);
    expect(cardNames(all)).toEqual(['Place a', 'Place b']);
    expect(topRated.compareDocumentPosition(all) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.queryByText(/4\.5 or higher/)).not.toBeInTheDocument();
  });

  it('leaves Top rated out when no Place has 4.5 or higher', async () => {
    renderPage({ topRated: [], all: [place('b', 4.1, 3)] });

    expect(await screen.findByRole('region', { name: /all 1 places in mitte/i })).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: /top rated/i })).not.toBeInTheDocument();
  });

  it('puts Places without a Rating last and marks them', async () => {
    renderPage({ topRated: [], all: [place('new', 0, 0), place('low', 3.2, 4), place('high', 4.3, 9)] });

    const all = await screen.findByRole('region', { name: /all 3 places in mitte/i });
    expect(cardNames(all)).toEqual(['Place high', 'Place low', 'Place new']);
    expect(within(all).getAllByText('No ratings yet — be the first')).toHaveLength(1);
  });

  it('shows 20 Places at first and the next 20 on "Show 20 more"', async () => {
    const places = Array.from({ length: 45 }, (_, i) => place(`${100 + i}`, 4, 45 - i));
    renderPage({ topRated: [], all: places });

    const all = await screen.findByRole('region', { name: /all 45 places in mitte/i });
    expect(cardNames(all)).toHaveLength(20);
    await userEvent.click(within(all).getByRole('button', { name: 'Show 20 more' }));
    expect(cardNames(all)).toHaveLength(40);
    await userEvent.click(within(all).getByRole('button', { name: 'Show 20 more' }));
    expect(cardNames(all)).toHaveLength(45);
    expect(within(all).queryByRole('button', { name: 'Show 20 more' })).not.toBeInTheDocument();
  });

  it('shows Not found for an unknown Neighborhood and stays there', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      renderPage({ topRated: [], all: [], slug: 'atlantis' });

      expect(await screen.findByText('Not found')).toBeInTheDocument();
      act(() => {
        vi.advanceTimersByTime(5000);
      });
      expect(screen.getByText('Not found')).toBeInTheDocument();
      expect(screen.queryByText('Map')).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it('shows Not found without a Neighborhood in the URL', () => {
    renderPage({ topRated: [], all: [], path: '/neighborhood' });

    expect(screen.getByText('Not found')).toBeInTheDocument();
  });

  it('sends neighborhood_view once per page view, after the data has loaded', async () => {
    renderPage({ topRated: [place('a', 4.8, 10)], all: [place('a', 4.8, 10), place('b', 0, 0)] });

    await screen.findByRole('region', { name: /all 2 places in mitte/i });
    // Signing in on the page is still the same page view.
    act(() => {
      setUser({ id: 'user-1', displayName: 'Ada', email: 'ada@example.com', isGoogleUserUserWithoutPassword: false });
    });
    expect(trackedEvents('neighborhood_view')).toEqual([
      ['neighborhood_view', { neighborhood: 'Mitte', shortlists_shown: 0, places_total: 2, actor: 'guest' }],
    ]);
  });

  it('sends neighborhood_card_click with the section of the opened card', async () => {
    renderPage({ topRated: [place('a', 4.8, 10)], all: [place('a', 4.8, 10), place('b', 4.1, 3)] });

    const topRated = await screen.findByRole('region', { name: /top rated/i });
    await userEvent.click(within(topRated).getByRole('heading', { name: 'Place a' }));
    expect(await screen.findByText('Place page')).toBeInTheDocument();
    expect(trackedEvents('neighborhood_card_click')).toEqual([
      ['neighborhood_card_click', { neighborhood: 'Mitte', section: 'top_rated', actor: 'guest' }],
    ]);
  });

  it('tells a card from the full list apart', async () => {
    renderPage({ topRated: [place('a', 4.8, 10)], all: [place('a', 4.8, 10), place('b', 4.1, 3)] });

    const all = await screen.findByRole('region', { name: /all 2 places in mitte/i });
    await userEvent.click(within(all).getByRole('heading', { name: 'Place b' }));
    expect(trackedEvents('neighborhood_card_click')).toEqual([
      ['neighborhood_card_click', { neighborhood: 'Mitte', section: 'all', actor: 'guest' }],
    ]);
  });
});
