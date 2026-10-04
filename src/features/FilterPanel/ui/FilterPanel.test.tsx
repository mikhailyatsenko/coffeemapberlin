import { MockedProvider } from '@apollo/client/testing';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AvailableNeighborhoodsDocument, GetAvailableTagsDocument } from 'shared/generated/graphql';
import { resetFilters, setFilterPanelOpen } from 'shared/stores/filters';
import { FilterPanel } from './FilterPanel';

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
              availableNeighborhoods: { __typename: 'AvailableNeighborhoodsResponse', neighborhoods: [], total: 0 },
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
});
