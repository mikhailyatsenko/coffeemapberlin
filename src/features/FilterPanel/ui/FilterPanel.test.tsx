import { MockedProvider } from '@apollo/client/testing';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AvailableNeighborhoodsDocument, GetAvailableTagsDocument } from 'shared/generated/graphql';
import { resetFilters, setFilterPanelOpen } from 'shared/stores/filters';
import { FilterPanel } from './FilterPanel';

const NEIGHBORHOODS = ['Mitte', 'Pankow', 'Charlottenburg-Wilmersdorf'];

const renderPanel = () =>
  render(
    <MockedProvider
      mocks={[
        {
          request: { query: GetAvailableTagsDocument },
          result: {
            data: {
              availableAdditionalInfoTags: { __typename: 'AdditionalInfoTagsResponse', tags: ['Dogs allowed'] },
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
      <FilterPanel onApplyFilters={vi.fn()} onResetFilters={vi.fn()} hasActiveFilters={false} />
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
});
