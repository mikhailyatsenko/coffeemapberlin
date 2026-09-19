import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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

describe('SearchPlaces keyboard inset', () => {
  // jsdom has no visualViewport, so emulate one the keyboard can shrink
  class FakeVisualViewport extends EventTarget {
    height = 800;
    offsetTop = 0;

    openKeyboard(keyboardHeight: number, offsetTop = 0) {
      this.height = 800 - keyboardHeight;
      this.offsetTop = offsetTop;
      this.dispatchEvent(new Event('resize'));
    }
  }

  let viewport: FakeVisualViewport;
  const getInset = () => document.documentElement.style.getPropertyValue('--keyboard-inset');

  beforeEach(() => {
    setSearchQuery('');
    viewport = new FakeVisualViewport();
    vi.stubGlobal('visualViewport', viewport);
    vi.stubGlobal('innerHeight', 800);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    document.documentElement.style.removeProperty('--keyboard-inset');
  });

  it('exposes the keyboard height while the input is focused', async () => {
    render(<SearchPlaces resultsCount={0} />);
    expect(getInset()).toBe('');

    await userEvent.click(getInput());
    expect(getInset()).toBe('0px');

    act(() => {
      viewport.openKeyboard(300);
    });
    expect(getInset()).toBe('300px');
  });

  it('accounts for the visual viewport being scrolled (iOS)', async () => {
    render(<SearchPlaces resultsCount={0} />);
    await userEvent.click(getInput());

    act(() => {
      viewport.openKeyboard(300, 50);
    });
    expect(getInset()).toBe('250px');
  });

  it('removes the inset when the input loses focus', async () => {
    render(<SearchPlaces resultsCount={0} />);
    await userEvent.click(getInput());
    act(() => {
      viewport.openKeyboard(300);
    });

    await userEvent.tab();

    expect(getInset()).toBe('');
    act(() => {
      viewport.openKeyboard(200);
    });
    expect(getInset()).toBe('');
  });

  it('does nothing when visualViewport is unsupported', async () => {
    vi.stubGlobal('visualViewport', undefined);
    render(<SearchPlaces resultsCount={0} />);

    await userEvent.click(getInput());

    expect(getInset()).toBe('');
  });
});
