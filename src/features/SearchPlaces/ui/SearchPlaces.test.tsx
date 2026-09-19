import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { setSearchQuery, useFiltersStore } from 'shared/stores/filters';
import { EmptySearchResults } from './EmptySearchResults';
import { SearchPlaces } from './SearchPlaces';

const getInput = () => screen.getByRole('searchbox', { name: /search coffee shops by name/i });

describe('SearchPlaces', () => {
  beforeEach(() => {
    setSearchQuery('');
  });

  it('writes the typed query to the filters store', async () => {
    render(<SearchPlaces resultsCount={0} />);

    await userEvent.type(getInput(), 'bonanza');

    expect(useFiltersStore.getState().searchQuery).toBe('bonanza');
    expect(getInput()).toHaveValue('bonanza');
  });

  it('shows the results count only while searching', () => {
    const { rerender } = render(<SearchPlaces resultsCount={42} />);
    expect(screen.queryByText(/found/)).not.toBeInTheDocument();

    setSearchQuery('   ');
    rerender(<SearchPlaces resultsCount={42} />);
    expect(screen.queryByText(/found/)).not.toBeInTheDocument();

    setSearchQuery('bon');
    rerender(<SearchPlaces resultsCount={4} />);
    expect(screen.getByText('4 found')).toBeInTheDocument();

    rerender(<SearchPlaces resultsCount={0} />);
    expect(screen.getByText('0 found')).toBeInTheDocument();
  });

  it('clears the query with the clear button', async () => {
    setSearchQuery('bonanza');
    render(<SearchPlaces resultsCount={4} />);

    await userEvent.click(screen.getByRole('button', { name: /clear search/i }));

    expect(useFiltersStore.getState().searchQuery).toBe('');
    expect(getInput()).toHaveValue('');
    expect(screen.queryByRole('button', { name: /clear search/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/found/)).not.toBeInTheDocument();
  });

  it('clears the query on Escape', async () => {
    render(<SearchPlaces resultsCount={1} />);

    await userEvent.type(getInput(), 'barn{Escape}');

    expect(useFiltersStore.getState().searchQuery).toBe('');
  });
});

describe('EmptySearchResults', () => {
  beforeEach(() => {
    setSearchQuery('zzz');
  });

  it('shows the trimmed query and clears it on click', async () => {
    render(<EmptySearchResults query="  zzz  " />);

    expect(screen.getByText('“zzz”')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /clear search/i }));

    expect(useFiltersStore.getState().searchQuery).toBe('');
  });
});
