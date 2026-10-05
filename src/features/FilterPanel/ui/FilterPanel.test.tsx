import { MockedProvider, type MockedResponse } from '@apollo/client/testing';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  AvailableNeighborhoodsDocument,
  FilteredPlacesCountDocument,
  GetAvailableTagsDocument,
  type FilteredPlacesCountQueryVariables,
} from 'shared/generated/graphql';
import { resetFilters, setFilterPanelOpen, setNeighborhood, useFiltersStore } from 'shared/stores/filters';
import { FilterPanel } from './FilterPanel';

const NEIGHBORHOODS = ['Mitte', 'Pankow', 'Charlottenburg-Wilmersdorf'];

// Server order (alphabetical); common: Cash only, Dogs allowed, Free Wi-Fi, Outdoor seating, Vegan options
const TAGS = [
  'Board games',
  'Cash only',
  'Cash-only',
  'Cozy',
  'Dogs allowed',
  'Fireplace',
  'Free Wi-Fi',
  'Live music',
  'Outdoor seating',
  'Rooftop',
  'Specialty coffee',
  'Vegan options',
  'Wi-Fi',
];

const countMock = (
  variables: FilteredPlacesCountQueryVariables,
  result: { total: number } | Error,
): MockedResponse => ({
  request: { query: FilteredPlacesCountDocument, variables },
  ...(result instanceof Error
    ? { error: result }
    : { result: { data: { filteredPlaces: { __typename: 'PlacesResponse', total: result.total } } } }),
  maxUsageCount: Number.POSITIVE_INFINITY,
});

const COUNT_MOCKS = [
  countMock({}, { total: 408 }),
  countMock({ neighborhood: ['Mitte'] }, { total: 24 }),
  countMock({ neighborhood: ['Mitte'], additionalInfo: ['Dogs allowed'] }, { total: 0 }),
  countMock({ neighborhood: ['Pankow'] }, { total: 1 }),
  // Any other selection, for the tests that don't look at the count
  {
    request: { query: FilteredPlacesCountDocument },
    variableMatcher: () => true,
    result: { data: { filteredPlaces: { __typename: 'PlacesResponse', total: 12 } } },
    maxUsageCount: Number.POSITIVE_INFINITY,
  },
];

const renderPanel = ({ countMocks = COUNT_MOCKS, onApplyFilters = vi.fn() } = {}) =>
  render(
    <MockedProvider
      mocks={[
        ...countMocks,
        {
          request: { query: GetAvailableTagsDocument },
          result: {
            data: {
              availableAdditionalInfoTags: { __typename: 'AdditionalInfoTagsResponse', tags: TAGS },
            },
          },
        },
        {
          request: { query: AvailableNeighborhoodsDocument },
          result: {
            data: {
              availableNeighborhoods: {
                __typename: 'AvailableNeighborhoodsResponse',
                neighborhoods: NEIGHBORHOODS,
                total: NEIGHBORHOODS.length,
              },
            },
          },
        },
      ]}
    >
      <FilterPanel onApplyFilters={onApplyFilters} onResetFilters={vi.fn()} hasActiveFilters={false} />
    </MockedProvider>,
  );

describe('FilterPanel', () => {
  afterEach(() => {
    setFilterPanelOpen(false);
    resetFilters();
  });

  it('shows a spinner while the Features tags load, then the tags', async () => {
    setFilterPanelOpen(true);
    renderPanel();

    expect(screen.getByRole('status', { name: /loading features/i })).toBeInTheDocument();
    expect(screen.queryByText('Loading features...')).not.toBeInTheDocument();

    expect(await screen.findByText('Dogs allowed')).toBeInTheDocument();
    expect(screen.queryByRole('status', { name: /loading features/i })).not.toBeInTheDocument();
  });

  it('shows the Neighborhoods as a group with "All" pressed when nothing is selected', async () => {
    setFilterPanelOpen(true);
    renderPanel();

    const group = await screen.findByRole('group', { name: 'Neighborhood' });
    expect(await within(group).findByRole('button', { name: 'Mitte' })).toBeInTheDocument();

    expect(within(group).getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
    for (const name of NEIGHBORHOODS) {
      expect(within(group).getByRole('button', { name })).toHaveAttribute('aria-pressed', 'false');
    }
  });

  it('toggles Neighborhoods, and "All" clears the selection', async () => {
    const user = userEvent.setup();
    setFilterPanelOpen(true);
    renderPanel();

    const group = await screen.findByRole('group', { name: 'Neighborhood' });
    const all = within(group).getByRole('button', { name: 'All' });
    const mitte = await within(group).findByRole('button', { name: 'Mitte' });
    const pankow = within(group).getByRole('button', { name: 'Pankow' });

    await user.click(mitte);
    await user.click(pankow);
    expect(mitte).toHaveAttribute('aria-pressed', 'true');
    expect(pankow).toHaveAttribute('aria-pressed', 'true');
    expect(all).toHaveAttribute('aria-pressed', 'false');

    await user.click(mitte);
    expect(mitte).toHaveAttribute('aria-pressed', 'false');
    expect(pankow).toHaveAttribute('aria-pressed', 'true');

    await user.click(all);
    expect(all).toHaveAttribute('aria-pressed', 'true');
    for (const name of NEIGHBORHOODS) {
      expect(within(group).getByRole('button', { name })).toHaveAttribute('aria-pressed', 'false');
    }
  });

  describe('Features', () => {
    const openFeatures = async () => {
      setFilterPanelOpen(true);
      renderPanel();
      await screen.findByRole('button', { name: 'Dogs allowed' });
    };

    it('opens collapsed to the common Features, and "Show all" expands and collapses the list', async () => {
      const user = userEvent.setup();
      await openFeatures();

      for (const name of ['Cash only', 'Dogs allowed', 'Free Wi-Fi', 'Outdoor seating', 'Vegan options']) {
        expect(screen.getByRole('button', { name })).toBeInTheDocument();
      }
      expect(screen.queryByRole('button', { name: 'Board games' })).not.toBeInTheDocument();

      const toggle = screen.getByRole('button', { name: 'Show all 13 features' });
      expect(toggle).toHaveAttribute('aria-expanded', 'false');

      await user.click(toggle);
      expect(screen.getByRole('button', { name: 'Board games' })).toBeInTheDocument();
      expect(toggle).toHaveTextContent('Show fewer');
      expect(toggle).toHaveAttribute('aria-expanded', 'true');

      await user.click(toggle);
      expect(screen.queryByRole('button', { name: 'Board games' })).not.toBeInTheDocument();
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
    });

    it('narrows the Features to matches across all of them, ignoring case, spaces and hyphens', async () => {
      const user = userEvent.setup();
      await openFeatures();
      const search = screen.getByRole('searchbox', { name: 'Search features' });

      await user.type(search, 'cash only');
      expect(screen.getByRole('button', { name: 'Cash only' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Cash-only' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Dogs allowed' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /show all/i })).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Clear features search' }));
      expect(search).toHaveValue('');
      await user.type(search, 'WIFI');
      expect(screen.getByRole('button', { name: 'Free Wi-Fi' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Wi-Fi' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Cash only' })).not.toBeInTheDocument();
    });

    it('keeps a Feature selected via search visible and pressed after the search is cleared', async () => {
      const user = userEvent.setup();
      await openFeatures();
      const search = screen.getByRole('searchbox', { name: 'Search features' });

      await user.type(search, 'board');
      const boardGames = screen.getByRole('button', { name: 'Board games' });
      expect(boardGames).toHaveAttribute('aria-pressed', 'false');
      await user.click(boardGames);
      expect(boardGames).toHaveAttribute('aria-pressed', 'true');

      await user.click(screen.getByRole('button', { name: 'Clear features search' }));
      expect(screen.getByRole('button', { name: 'Board games' })).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByRole('button', { name: 'Dogs allowed' })).toHaveAttribute('aria-pressed', 'false');
      expect(screen.queryByRole('button', { name: 'Rooftop' })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /show all/i })).toHaveAttribute('aria-expanded', 'false');
    });

    it('says no Features match, and "Clear search" brings the collapsed list back', async () => {
      const user = userEvent.setup();
      await openFeatures();

      await user.type(screen.getByRole('searchbox', { name: 'Search features' }), 'sauna');
      expect(screen.getByText(/No features match “sauna”/)).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Dogs allowed' })).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Clear search' }));
      expect(screen.queryByText(/No features match/)).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Dogs allowed' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Show all 13 features' })).toBeInTheDocument();
    });

    it('clears a non-empty search on Escape and keeps the modal open; Escape again closes it', async () => {
      const user = userEvent.setup();
      await openFeatures();
      const search = screen.getByRole('searchbox', { name: 'Search features' });

      await user.type(search, 'dogs');
      await user.keyboard('{Escape}');
      expect(search).toHaveValue('');
      expect(useFiltersStore.getState().isFilterPanelOpen).toBe(true);
      expect(screen.getByRole('searchbox', { name: 'Search features' })).toBeInTheDocument();

      await user.keyboard('{Escape}');
      expect(useFiltersStore.getState().isFilterPanelOpen).toBe(false);
      expect(screen.queryByRole('searchbox', { name: 'Search features' })).not.toBeInTheDocument();
    });

    it('opens again with an empty search and the list collapsed, keeping the selected Features', async () => {
      const user = userEvent.setup();
      await openFeatures();

      await user.click(screen.getByRole('button', { name: 'Show all 13 features' }));
      await user.click(screen.getByRole('button', { name: 'Rooftop' }));
      await user.type(screen.getByRole('searchbox', { name: 'Search features' }), 'roof');

      act(() => {
        setFilterPanelOpen(false);
      });
      act(() => {
        setFilterPanelOpen(true);
      });

      expect(await screen.findByRole('searchbox', { name: 'Search features' })).toHaveValue('');
      expect(screen.getByRole('button', { name: 'Rooftop' })).toHaveAttribute('aria-pressed', 'true');
      expect(screen.queryByRole('button', { name: 'Board games' })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Show all 13 features' })).toHaveAttribute('aria-expanded', 'false');
    });
  });
  describe('Live result count', () => {
    it('reads "Counting places…" on open, then the total of every Place', async () => {
      setFilterPanelOpen(true);
      renderPanel();

      expect(screen.getByText('Counting places…')).toBeInTheDocument();
      const count = await screen.findByText('408 places match');
      expect(count.closest('[role="status"]')).not.toBeNull();
      expect(screen.queryByText('Counting places…')).not.toBeInTheDocument();
    });

    it('counts again on every open instead of showing the count from the last time', async () => {
      setFilterPanelOpen(true);
      renderPanel();
      await screen.findByText('408 places match');

      act(() => {
        setFilterPanelOpen(false);
      });
      act(() => {
        setFilterPanelOpen(true);
      });

      expect(screen.getByText('Counting places…')).toBeInTheDocument();
      expect(await screen.findByText('408 places match')).toBeInTheDocument();
    });

    it('updates the count after picking a Neighborhood, and says when nothing matches', async () => {
      const user = userEvent.setup();
      setFilterPanelOpen(true);
      renderPanel();
      await screen.findByText('408 places match');

      const group = screen.getByRole('group', { name: 'Neighborhood' });
      await user.click(await within(group).findByRole('button', { name: 'Mitte' }));
      expect(await screen.findByText('24 places match')).toBeInTheDocument();

      await user.click(await screen.findByRole('button', { name: 'Dogs allowed' }));
      expect(await screen.findByText('No places match these filters')).toBeInTheDocument();
      expect(screen.getByText('Try removing a feature or lowering the rating')).toBeInTheDocument();
    });

    it('reads "1 place matches" for a single Place', async () => {
      setNeighborhood(['Pankow']);
      setFilterPanelOpen(true);
      renderPanel();

      expect(await screen.findByText('1 place matches')).toBeInTheDocument();
    });

    it('shows no count when the request fails, and Apply still applies the Filters', async () => {
      const user = userEvent.setup();
      const onApplyFilters = vi.fn();
      setFilterPanelOpen(true);
      renderPanel({ countMocks: [countMock({}, new Error('Network down'))], onApplyFilters });

      await waitFor(() => expect(screen.queryByText('Counting places…')).not.toBeInTheDocument());
      expect(screen.queryByText(/places? match/)).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Apply Filters' }));
      expect(onApplyFilters).toHaveBeenCalledTimes(1);
    });

    it('counts again after a failed request once the Filters change', async () => {
      const user = userEvent.setup();
      setFilterPanelOpen(true);
      renderPanel({
        countMocks: [countMock({}, new Error('Network down')), countMock({ neighborhood: ['Mitte'] }, { total: 24 })],
      });
      await waitFor(() => expect(screen.queryByText('Counting places…')).not.toBeInTheDocument());

      const group = screen.getByRole('group', { name: 'Neighborhood' });
      await user.click(await within(group).findByRole('button', { name: 'Mitte' }));
      expect(screen.getByText('Counting places…')).toBeInTheDocument();
      expect(await screen.findByText('24 places match')).toBeInTheDocument();
    });
  });
});
