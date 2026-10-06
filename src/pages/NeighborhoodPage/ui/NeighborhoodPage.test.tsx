import { MockedProvider, type MockedResponse } from '@apollo/client/testing';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  AddRatingDocument,
  FilteredPlacesDocument,
  type FilteredPlacesQuery,
  NeighborhoodShortlistsDocument,
  ShortlistId,
} from 'shared/generated/graphql';
import { trackEvent } from 'shared/lib/analytics';
import type * as guestModule from 'shared/lib/guest';
import { ensureGuestIdentity } from 'shared/lib/guest';
import { setUser } from 'shared/stores/auth';
import { resetFilters, setSearchQuery, useFiltersStore } from 'shared/stores/filters';
import { setShowFavorites, usePlacesStore } from 'shared/stores/places';
import { NeighborhoodPage } from './NeighborhoodPage';

vi.mock('shared/lib/analytics', () => ({ trackEvent: vi.fn() }));
vi.mock('shared/lib/guest', async (importOriginal) => {
  const ensureGuestIdentity = vi.fn();
  return {
    ...(await importOriginal<typeof guestModule>()),
    ensureGuestIdentity,
    contributionCredentials: (isSignedIn: boolean) => (isSignedIn ? Promise.resolve({}) : ensureGuestIdentity()),
  };
});

type Place = FilteredPlacesQuery['filteredPlaces']['places'][number];

const place = (
  id: string,
  averageRating: number,
  ratingCount: number,
  ownRating: number | null = null,
  address = '',
  shortlistIds: ShortlistId[] = [],
): Place => ({
  __typename: 'Place',
  id,
  type: 'Feature',
  geometry: { __typename: 'Geometry', type: 'Point', coordinates: [13.4, 52.5] },
  properties: {
    __typename: 'PlaceProperties',
    id,
    name: `Place ${id}`,
    description: '',
    address,
    image: '',
    instagram: '',
    averageRating,
    ratingCount,
    favoriteCount: 0,
    isFavorite: false,
    ownRating,
    googleId: null,
    neighborhood: 'Mitte',
    shortlistIds,
  },
});

const filteredPlacesMock = (variables: Record<string, unknown>, places: Place[]): MockedResponse => ({
  request: { query: FilteredPlacesDocument, variables },
  result: {
    data: { filteredPlaces: { __typename: 'FilteredPlacesResult', places, total: places.length } },
  },
});

interface ShortlistData {
  places: Place[];
  total: number;
}

type Shortlists = Partial<Record<ShortlistId, ShortlistData>>;

const SHORTLIST_ORDER = [
  ShortlistId.work,
  ShortlistId.dogFriendly,
  ShortlistId.outdoorSeating,
  ShortlistId.breakfastBrunch,
];

const AMENITIES: Record<ShortlistId, string[]> = {
  work: ['Good for working on laptop', 'Wi-Fi'],
  dogFriendly: ['Dogs allowed'],
  outdoorSeating: ['Outdoor seating'],
  breakfastBrunch: ['Breakfast'],
};

/** The server always returns all four Shortlists, in this order. */
const shortlistsMock = (neighborhood: string, shortlists: Shortlists): MockedResponse => ({
  request: { query: NeighborhoodShortlistsDocument, variables: { neighborhood } },
  result: {
    data: {
      neighborhoodShortlists: SHORTLIST_ORDER.map((id) => ({
        __typename: 'Shortlist',
        id,
        amenities: AMENITIES[id],
        places: shortlists[id]?.places ?? [],
        total: shortlists[id]?.total ?? 0,
      })),
    },
  },
});

/** A Shortlist of `count` Places whose ids start with `prefix`. */
const shortlist = (prefix: string, count: number): ShortlistData => ({
  places: Array.from({ length: Math.min(count, 5) }, (_, i) => place(`${prefix}${i}`, 4.5 - i / 10, 5)),
  total: count,
});

const guest = { guestId: 'guest-1', guestSecret: 'secret-1' };

const addRatingMock = (placeId: string, rating: number, onCall = () => {}): MockedResponse => ({
  request: { query: AddRatingDocument, variables: { placeId, rating, ...guest } },
  result: () => {
    onCall();
    return {
      data: {
        addRating: {
          __typename: 'AddRatingResponse',
          averageRating: 3,
          ratingCount: 99,
          reviewId: 'review-1',
          userRating: rating,
        },
      },
    };
  },
});

const failingAddRatingMock = (placeId: string, rating: number): MockedResponse => ({
  request: { query: AddRatingDocument, variables: { placeId, rating, ...guest } },
  error: new Error('Network down'),
});

const renderPage = ({
  topRated,
  all,
  shortlists = {},
  shortlistsFail = false,
  slug = 'mitte',
  path = `/neighborhood/${slug}`,
  mocks = [],
}: {
  topRated: Place[];
  all: Place[];
  shortlists?: Shortlists;
  shortlistsFail?: boolean;
  slug?: string;
  path?: string;
  mocks?: MockedResponse[];
}) =>
  render(
    <MockedProvider
      mocks={[
        filteredPlacesMock({ neighborhood: slug, minRating: 4.5 }, topRated),
        filteredPlacesMock({ neighborhood: slug }, all),
        shortlistsFail
          ? {
              request: { query: NeighborhoodShortlistsDocument, variables: { neighborhood: slug } },
              error: new Error('down'),
            }
          : shortlistsMock(slug, shortlists),
        ...mocks,
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

/** Stands in for the browser's IntersectionObserver; `enterViewport` fires it for one element. */
const observed = new Map<Element, FakeIntersectionObserver>();
class FakeIntersectionObserver {
  constructor(private readonly callback: IntersectionObserverCallback) {}

  observe(element: Element) {
    observed.set(element, this);
  }

  unobserve(element: Element) {
    observed.delete(element);
  }

  disconnect() {
    for (const [element, observer] of observed) if (observer === this) observed.delete(element);
  }

  fire(element: Element) {
    const entry = { target: element, isIntersecting: true } as unknown as IntersectionObserverEntry;
    this.callback([entry], this as unknown as IntersectionObserver);
  }
}
// jsdom has no scrollIntoView; a focused shelf card calls it.
Element.prototype.scrollIntoView = vi.fn();

const enterViewport = (element: Element) => {
  act(() => {
    observed.get(element)?.fire(element);
  });
};

const section = (name: RegExp) => screen.getByRole('region', { name });
/** The card of the Place named `name` in a shelf. */
const card = (region: HTMLElement, name: string) => within(region).getByRole('article', { name });
/** The row of the Place named `name` in the full list. */
const row = card;
const bean = (rowElement: HTMLElement, rating: number) =>
  within(rowElement).getByRole('radio', { name: `${rating} of 5` });

const cardNames = (region: HTMLElement) =>
  within(region)
    .getAllByRole('heading', { level: 3 })
    .map((heading) => heading.textContent);

describe('NeighborhoodPage', () => {
  beforeEach(() => {
    setUser(null);
    vi.mocked(ensureGuestIdentity).mockResolvedValue(guest);
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
  });

  afterEach(() => {
    vi.mocked(trackEvent).mockClear();
    vi.mocked(ensureGuestIdentity).mockReset();
    resetFilters();
    setSearchQuery('');
    setShowFavorites(false);
    vi.unstubAllGlobals();
    observed.clear();
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

    expect(await screen.findByRole('region', { name: /all 1 place in mitte/i })).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: /top rated/i })).not.toBeInTheDocument();
  });

  it('names the full list in the singular for a Neighborhood with one Place', async () => {
    renderPage({ topRated: [], all: [place('b', 4.1, 3)] });

    expect(await screen.findByRole('heading', { name: 'All 1 Place in Mitte' })).toBeInTheDocument();
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

  it('offers to suggest a missing Place under the full list', async () => {
    renderPage({ topRated: [], all: [place('b', 4.1, 3)] });

    const all = await screen.findByRole('region', { name: /all 1 place in mitte/i });
    expect(within(all).getByText(/know a place that’s missing\?/i)).toBeInTheDocument();
    expect(within(all).getByRole('link', { name: 'Suggest it' })).toHaveAttribute('href', '/suggest');
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

  it('shows the Shortlists between Top rated and the full list, in the server order', async () => {
    renderPage({
      topRated: [place('a', 4.8, 10)],
      all: [place('a', 4.8, 10)],
      shortlists: {
        work: shortlist('w', 7),
        dogFriendly: shortlist('d', 3),
        outdoorSeating: shortlist('o', 4),
        breakfastBrunch: shortlist('b', 5),
      },
    });

    await screen.findByRole('region', { name: /all 1 place in mitte/i });
    expect(screen.getAllByRole('region').map((region) => region.getAttribute('aria-labelledby'))).toEqual([
      'top-rated-title',
      'work-title',
      'dog-friendly-title',
      'outdoor-seating-title',
      'breakfast-brunch-title',
      'all-places-title',
    ]);
    expect(cardNames(section(/^work$/i))).toEqual(['Place w0', 'Place w1', 'Place w2', 'Place w3', 'Place w4']);
    expect(section(/dog friendly/i)).toBeInTheDocument();
    expect(section(/outdoor seating/i)).toBeInTheDocument();
    expect(section(/breakfast & brunch/i)).toBeInTheDocument();
  });

  it('gives each Shortlist its anchor as the section id', async () => {
    renderPage({
      topRated: [],
      all: [place('a', 4.8, 10)],
      shortlists: {
        work: shortlist('w', 3),
        dogFriendly: shortlist('d', 3),
        outdoorSeating: shortlist('o', 3),
        breakfastBrunch: shortlist('b', 3),
      },
    });

    await screen.findByRole('region', { name: /all 1 place in mitte/i });
    expect(section(/^work$/i)).toHaveAttribute('id', 'work');
    expect(section(/dog friendly/i)).toHaveAttribute('id', 'dog-friendly');
    expect(section(/outdoor seating/i)).toHaveAttribute('id', 'outdoor-seating');
    expect(section(/breakfast & brunch/i)).toHaveAttribute('id', 'breakfast-brunch');
  });

  it('hides a Shortlist with fewer than 3 Places', async () => {
    renderPage({
      topRated: [],
      all: [place('a', 4.8, 10)],
      shortlists: { work: shortlist('w', 2), dogFriendly: shortlist('d', 3) },
    });

    await screen.findByRole('region', { name: /all 1 place in mitte/i });
    expect(screen.queryByRole('region', { name: /^work$/i })).not.toBeInTheDocument();
    expect(section(/dog friendly/i)).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: /outdoor seating/i })).not.toBeInTheDocument();
  });

  it('still lists the Places when the Shortlists fail to load', async () => {
    renderPage({ topRated: [place('a', 4.8, 10)], all: [place('a', 4.8, 10)], shortlistsFail: true });

    expect(await screen.findByRole('region', { name: /all 1 place in mitte/i })).toBeInTheDocument();
    expect(section(/top rated/i)).toBeInTheDocument();
    expect(screen.queryByText(/couldn’t load/i)).not.toBeInTheDocument();
  });

  it('counts the Shortlists shown in neighborhood_view', async () => {
    renderPage({
      topRated: [],
      all: [place('a', 4.8, 10)],
      shortlists: { work: shortlist('w', 2), dogFriendly: shortlist('d', 3), breakfastBrunch: shortlist('b', 9) },
    });

    await screen.findByRole('region', { name: /all 1 place in mitte/i });
    expect(trackedEvents('neighborhood_view')).toEqual([
      ['neighborhood_view', { neighborhood: 'Mitte', shortlists_shown: 2, places_total: 1, actor: 'guest' }],
    ]);
  });

  it('sends shortlist_view once when a Shortlist first enters the viewport', async () => {
    renderPage({
      topRated: [],
      all: [place('a', 4.8, 10)],
      shortlists: { dogFriendly: shortlist('d', 3), outdoorSeating: shortlist('o', 3) },
    });

    const dogFriendly = await screen.findByRole('region', { name: /dog friendly/i });
    expect(trackedEvents('shortlist_view')).toEqual([]);
    enterViewport(dogFriendly);
    enterViewport(dogFriendly);
    expect(trackedEvents('shortlist_view')).toEqual([
      ['shortlist_view', { neighborhood: 'Mitte', shortlist: 'dogFriendly', actor: 'guest' }],
    ]);
  });

  it('sends the Shortlist id as the section of a Shortlist card', async () => {
    renderPage({
      topRated: [],
      all: [place('a', 4.8, 10)],
      shortlists: { outdoorSeating: shortlist('o', 3) },
    });

    const outdoor = await screen.findByRole('region', { name: /outdoor seating/i });
    await userEvent.click(within(outdoor).getByRole('link', { name: 'Place o1' }));
    expect(trackedEvents('neighborhood_card_click')).toEqual([
      ['neighborhood_card_click', { neighborhood: 'Mitte', section: 'outdoorSeating', actor: 'guest' }],
    ]);
  });

  it('sends neighborhood_card_click with the section of the opened card', async () => {
    renderPage({ topRated: [place('a', 4.8, 10)], all: [place('a', 4.8, 10), place('b', 4.1, 3)] });

    const topRated = await screen.findByRole('region', { name: /top rated/i });
    await userEvent.click(within(topRated).getByRole('link', { name: 'Place a' }));
    expect(await screen.findByText('Place page')).toBeInTheDocument();
    expect(trackedEvents('neighborhood_card_click')).toEqual([
      ['neighborhood_card_click', { neighborhood: 'Mitte', section: 'top_rated', actor: 'guest' }],
    ]);
  });

  it('tells a card from the full list apart', async () => {
    renderPage({ topRated: [place('a', 4.8, 10)], all: [place('a', 4.8, 10), place('b', 4.1, 3)] });

    const all = await screen.findByRole('region', { name: /all 2 places in mitte/i });
    await userEvent.click(within(all).getByRole('link', { name: 'Place b' }));
    expect(trackedEvents('neighborhood_card_click')).toEqual([
      ['neighborhood_card_click', { neighborhood: 'Mitte', section: 'all', actor: 'guest' }],
    ]);
  });

  it('opens the map filtered by the Neighborhood, the Shortlist’s Amenities and 4+ Rating on "See all N on the map"', async () => {
    setSearchQuery('bonanza');
    setShowFavorites(true);
    renderPage({
      topRated: [],
      all: [place('a', 4.8, 10)],
      shortlists: { work: shortlist('w', 7), dogFriendly: shortlist('d', 3) },
    });

    const work = await screen.findByRole('region', { name: /^work$/i });
    await userEvent.click(within(work).getByRole('link', { name: 'See all 7 on the map' }));

    expect(await screen.findByText('Map')).toBeInTheDocument();
    expect(useFiltersStore.getState()).toMatchObject({
      neighborhood: ['Mitte'],
      selectedTags: ['Good for working on laptop', 'Wi-Fi'],
      minRating: 4,
      searchQuery: '',
    });
    expect(usePlacesStore.getState().showFavorites).toBe(false);
    expect(trackedEvents('shortlist_map_click')).toEqual([
      ['shortlist_map_click', { neighborhood: 'Mitte', shortlist: 'work', count: 7, actor: 'guest' }],
    ]);
  });

  describe('header', () => {
    it('says how many Places the Neighborhood has and how many are rated 4.5+, counting Top rated before the cut', async () => {
      const top = Array.from({ length: 8 }, (_, i) => place(`t${i}`, 4.5 + i / 20, 5));
      renderPage({ topRated: top, all: [...top, place('b', 4.1, 3), place('c', 3, 2)] });

      expect(await screen.findByText('10 Places · 8 rated 4.5+')).toBeInTheDocument();
      expect(screen.queryByText(/every Place on the map/)).not.toBeInTheDocument();
    });

    it('reads right in the singular', async () => {
      const only = place('a', 4.8, 10);
      renderPage({ topRated: [only], all: [only] });

      expect(await screen.findByText('1 Place · 1 rated 4.5+')).toBeInTheDocument();
    });

    it('leaves the 4.5+ count out when no Place has it', async () => {
      renderPage({ topRated: [], all: [place('b', 4.1, 3), place('c', 3, 2)] });

      expect(await screen.findByText('2 Places')).toBeInTheDocument();
    });

    it('opens the map filtered by the Neighborhood only on "Open on the map"', async () => {
      setSearchQuery('bonanza');
      setShowFavorites(true);
      useFiltersStore.setState({ selectedTags: ['Wi-Fi'], minRating: 4 });
      const great = place('a', 4.8, 10);
      renderPage({ topRated: [great], all: [great, place('b', 4.1, 3)] });

      await userEvent.click(await screen.findByRole('link', { name: 'Open on the map' }));

      expect(await screen.findByText('Map')).toBeInTheDocument();
      expect(useFiltersStore.getState()).toMatchObject({
        neighborhood: ['Mitte'],
        selectedTags: [],
        minRating: 0,
        searchQuery: '',
      });
      expect(usePlacesStore.getState().showFavorites).toBe(false);
      expect(trackedEvents('neighborhood_map_open')).toEqual([
        ['neighborhood_map_open', { neighborhood: 'Mitte', places_total: 2, actor: 'guest' }],
      ]);
      expect(trackedEvents('shortlist_map_click')).toEqual([]);
    });
  });

  describe('Top rated', () => {
    const eight = Array.from({ length: 8 }, (_, i) => place(`t${i}`, 4.5 + i / 20, 5));

    it('shows the 6 best Places, best first', async () => {
      renderPage({ topRated: eight, all: eight });

      const topRated = await screen.findByRole('region', { name: /top rated/i });
      expect(cardNames(topRated)).toEqual(['Place t7', 'Place t6', 'Place t5', 'Place t4', 'Place t3', 'Place t2']);
    });

    it('opens the map filtered by the Neighborhood and 4.5+ Rating on "See all N on the map"', async () => {
      setSearchQuery('bonanza');
      setShowFavorites(true);
      useFiltersStore.setState({ selectedTags: ['Wi-Fi'] });
      renderPage({ topRated: eight, all: eight });

      const topRated = await screen.findByRole('region', { name: /top rated/i });
      await userEvent.click(within(topRated).getByRole('link', { name: 'See all 8 on the map' }));

      expect(await screen.findByText('Map')).toBeInTheDocument();
      expect(useFiltersStore.getState()).toMatchObject({
        neighborhood: ['Mitte'],
        selectedTags: [],
        minRating: 4.5,
        searchQuery: '',
      });
      expect(usePlacesStore.getState().showFavorites).toBe(false);
      expect(trackedEvents('shortlist_map_click')).toEqual([
        ['shortlist_map_click', { neighborhood: 'Mitte', shortlist: 'top_rated', count: 8, actor: 'guest' }],
      ]);
    });
  });

  describe('shelf cards', () => {
    it('show no Neighborhood badge and no "Rate it"', async () => {
      const a = place('a', 4.8, 10);
      renderPage({ topRated: [a], all: [a], shortlists: { work: shortlist('w', 3) } });

      const topRated = await screen.findByRole('region', { name: /top rated/i });
      for (const shelfCard of [card(topRated, 'Place a'), card(section(/^work$/i), 'Place w0')]) {
        expect(within(shelfCard).queryByText('Mitte')).not.toBeInTheDocument();
        expect(within(shelfCard).queryByText('Been here? Rate it')).not.toBeInTheDocument();
        expect(within(shelfCard).queryByRole('radio')).not.toBeInTheDocument();
      }
      expect(
        within(row(section(/all 1 place in mitte/i), 'Place a')).getByText('Been here? Rate it'),
      ).toBeInTheDocument();
    });

    it.each([
      ['Wiener Str. 62, 10999', 'Wiener Str. 62'],
      ['Luckenwalder Str. 6b, 10963', 'Luckenwalder Str. 6b'],
      ['c/o St. Agnes, Alexandrinenstraße 118-121, 10969', 'c/o St. Agnes, Alexandrinenstraße 118-121'],
      ['Torstraße 1', 'Torstraße 1'],
    ])('show the street of "%s" as "%s"', async (address, street) => {
      const a = place('a', 4.8, 10, null, address);
      renderPage({ topRated: [a], all: [a] });

      const topRated = await screen.findByRole('region', { name: /top rated/i });
      const shelfCard = card(topRated, 'Place a');
      expect(within(shelfCard).getByText(street)).toBeInTheDocument();
      expect(shelfCard).not.toHaveTextContent(/\b\d{5}\b/);
    });
  });

  describe('full-list rows', () => {
    it('show the name, the Average rating and the street, without the Neighborhood badge or the description', async () => {
      const a = place('a', 4.8, 10, null, 'Wiener Str. 62, 10999');
      a.properties.description = 'A long story about the beans';
      renderPage({ topRated: [], all: [a, place('new', 0, 0)] });

      const all = await screen.findByRole('region', { name: /all 2 places in mitte/i });
      const rowA = row(all, 'Place a');
      expect(within(rowA).getByRole('link', { name: 'Place a' })).toBeInTheDocument();
      expect(within(rowA).getByText('4.8')).toBeInTheDocument();
      expect(within(rowA).getByText('Wiener Str. 62')).toBeInTheDocument();
      expect(rowA).not.toHaveTextContent(/\b\d{5}\b/);
      expect(within(rowA).queryByText('Mitte')).not.toBeInTheDocument();
      expect(within(rowA).queryByText('A long story about the beans')).not.toBeInTheDocument();
      expect(within(row(all, 'Place new')).getByText('No ratings yet — be the first')).toBeInTheDocument();
    });
  });

  describe('Amenity icons', () => {
    /** The names of a card's or row's Amenity icons, in the order shown; the photo is hidden from the tree. */
    const iconNames = (element: HTMLElement) =>
      within(element)
        .queryAllByRole('img')
        .map((icon) => icon.getAttribute('aria-label'));

    const a = place('a', 4.8, 10, null, '', [ShortlistId.work, ShortlistId.dogFriendly, ShortlistId.breakfastBrunch]);

    it('show one named icon per Shortlist Amenity of the Place, in server order, on a shelf card and a row', async () => {
      renderPage({ topRated: [a], all: [a] });

      const topRated = await screen.findByRole('region', { name: /top rated/i });
      const all = section(/all 1 place in mitte/i);
      for (const element of [card(topRated, 'Place a'), row(all, 'Place a')]) {
        expect(iconNames(element)).toEqual(['Good for work', 'Dog friendly', 'Breakfast & brunch']);
        expect(within(element).getByTitle('Dog friendly')).toBeInTheDocument();
      }
    });

    it('name each of the four Shortlist Amenities', async () => {
      const every = place('e', 4.8, 10, null, '', [...SHORTLIST_ORDER]);
      renderPage({ topRated: [every], all: [every] });

      const topRated = await screen.findByRole('region', { name: /top rated/i });
      expect(iconNames(card(topRated, 'Place e'))).toEqual([
        'Good for work',
        'Dog friendly',
        'Outdoor seating',
        'Breakfast & brunch',
      ]);
    });

    it('show no icons for a Place without Shortlist Amenities', async () => {
      const plain = place('p', 4.8, 10);
      renderPage({ topRated: [plain], all: [plain] });

      const topRated = await screen.findByRole('region', { name: /top rated/i });
      expect(iconNames(card(topRated, 'Place p'))).toEqual([]);
      expect(iconNames(row(section(/all 1 place in mitte/i), 'Place p'))).toEqual([]);
    });

    it('skip a Shortlist this build has no icon for, instead of breaking the card', async () => {
      // A newer server may add a Shortlist before the client knows it.
      const newer = place('n', 4.8, 10, null, '', [ShortlistId.dogFriendly, 'quiz' as ShortlistId]);
      renderPage({ topRated: [newer], all: [newer] });

      const topRated = await screen.findByRole('region', { name: /top rated/i });
      expect(iconNames(card(topRated, 'Place n'))).toEqual(['Dog friendly']);
    });
  });

  describe('rating from a row', () => {
    // Place a sits in Outdoor seating and in the full list.
    const shortlists = (a: Place) => ({
      outdoorSeating: { places: [a, place('o1', 4.4, 5), place('o2', 4.3, 5)], total: 3 },
    });

    it('saves a Guest Rating on one tap from the full list, without leaving the page', async () => {
      const user = userEvent.setup();
      const addRating = vi.fn();
      const a = place('a', 4.8, 10);
      renderPage({
        topRated: [],
        all: [place('b', 4.9, 2), a],
        shortlists: shortlists(a),
        mocks: [addRatingMock('a', 4, addRating)],
      });

      const all = await screen.findByRole('region', { name: /all 2 places in mitte/i });
      expect(within(row(all, 'Place a')).getByText('Been here? Rate it')).toBeInTheDocument();
      await user.click(bean(row(all, 'Place a'), 4));

      expect(within(row(all, 'Place a')).getByText(/Your rating: 4/)).toBeInTheDocument();
      await waitFor(() => {
        expect(addRating).toHaveBeenCalledTimes(1);
      });
      expect(screen.queryByText('Place page')).not.toBeInTheDocument();
      // The Average rating and the order stay as the page view showed them.
      expect(within(row(all, 'Place a')).getByText('4.8')).toBeInTheDocument();
      expect(cardNames(all)).toEqual(['Place b', 'Place a']);
      expect(within(row(all, 'Place b')).getByText('Been here? Rate it')).toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('puts the beans back with the reason when the save fails', async () => {
      const user = userEvent.setup();
      vi.spyOn(console, 'error').mockImplementation(() => {});
      renderPage({ topRated: [], all: [place('a', 4.8, 10)], mocks: [failingAddRatingMock('a', 4)] });

      const all = await screen.findByRole('region', { name: /all 1 place in mitte/i });
      await user.click(bean(row(all, 'Place a'), 4));

      expect(await within(row(all, 'Place a')).findByRole('alert')).toHaveTextContent(/check your connection/i);
      expect(bean(row(all, 'Place a'), 4)).not.toBeChecked();
      expect(within(row(all, 'Place a')).queryByText(/Your rating/)).not.toBeInTheDocument();
      vi.mocked(console.error).mockRestore();
    });

    it('shows the Rating a returning visitor gave earlier, and lets them change it', async () => {
      const user = userEvent.setup();
      renderPage({ topRated: [], all: [place('a', 4.8, 10, 3)] });

      const all = await screen.findByRole('region', { name: /all 1 place in mitte/i });
      expect(within(row(all, 'Place a')).getByText(/Your rating: 3/)).toBeInTheDocument();
      expect(within(row(all, 'Place a')).queryByText('Been here? Rate it')).not.toBeInTheDocument();
      await user.click(within(row(all, 'Place a')).getByRole('button', { name: 'change' }));
      expect(bean(row(all, 'Place a'), 3)).toBeChecked();
    });

    it('sends rating_saved and contribution_failed with the card surface and section', async () => {
      const user = userEvent.setup();
      vi.spyOn(console, 'error').mockImplementation(() => {});
      const a = place('a', 4.8, 10);
      renderPage({
        topRated: [],
        all: [a, place('b', 4.1, 3)],
        shortlists: shortlists(a),
        mocks: [addRatingMock('a', 5), failingAddRatingMock('b', 2)],
      });

      const all = await screen.findByRole('region', { name: /all 2 places in mitte/i });
      await user.click(bean(row(all, 'Place a'), 5));
      await waitFor(() => {
        expect(trackedEvents('rating_saved')).toEqual([
          [
            'rating_saved',
            {
              place_id: 'a',
              actor: 'guest',
              rating: 5,
              is_change: false,
              surface: 'neighborhood_card',
              section: 'all',
            },
          ],
        ]);
      });
      await user.click(bean(row(all, 'Place b'), 2));
      await waitFor(() => {
        expect(trackedEvents('contribution_failed')).toEqual([
          [
            'contribution_failed',
            {
              place_id: 'b',
              actor: 'guest',
              kind: 'rating',
              reason: 'network',
              surface: 'neighborhood_card',
              section: 'all',
            },
          ],
        ]);
      });
      vi.mocked(console.error).mockRestore();
    });

    it('asks no Characteristic question after a Rating', async () => {
      const user = userEvent.setup();
      const a = place('a', 4.8, 10);
      renderPage({ topRated: [a], all: [a], shortlists: shortlists(a), mocks: [addRatingMock('a', 4)] });

      const all = await screen.findByRole('region', { name: /all 1 place in mitte/i });
      await user.click(bean(row(all, 'Place a'), 4));

      await waitFor(() => {
        expect(trackedEvents('rating_saved')).toHaveLength(1);
      });
      expect(within(row(all, 'Place a')).getByText(/Your rating: 4/)).toBeInTheDocument();
      expect(screen.queryByRole('group')).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Yes' })).not.toBeInTheDocument();
      expect(trackedEvents('characteristic_answered')).toEqual([]);
    });
  });
});
