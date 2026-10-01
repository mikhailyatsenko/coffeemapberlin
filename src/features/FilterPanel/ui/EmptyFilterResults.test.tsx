import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { EmptyFilterResults } from './EmptyFilterResults';

vi.mock('shared/stores/filters', () => ({
  resetFilters: vi.fn(),
}));

describe('EmptyFilterResults', () => {
  it('renders the search icon as an image, not emoji text', () => {
    const { container } = render(<EmptyFilterResults onResetFilters={vi.fn()} />);

    expect(container.querySelector('img')).toBeInTheDocument();
    expect(screen.queryByText('🔍')).not.toBeInTheDocument();
  });

  it('resets filters when the Reset Filters button is clicked', async () => {
    const onResetFilters = vi.fn();
    const user = userEvent.setup();
    render(<EmptyFilterResults onResetFilters={onResetFilters} />);

    const resetButton = screen.getByRole('button', { name: /reset filters/i });
    await user.click(resetButton);

    expect(onResetFilters).toHaveBeenCalledTimes(1);
  });
});
