import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import RatingWidget from './RatingWidget';

const ratingGroup = () => screen.getByRole('radiogroup', { name: 'Rating' });

describe('RatingWidget as a control', () => {
  it('offers each value from 1 to 5 as a labelled radio', () => {
    render(<RatingWidget isClickable handleRating={vi.fn()} />);

    const radios = screen.getAllByRole('radio');
    expect(radios.map((radio) => radio.getAttribute('aria-label'))).toEqual([
      '1 of 5',
      '2 of 5',
      '3 of 5',
      '4 of 5',
      '5 of 5',
    ]);
    expect(ratingGroup()).toContainElement(radios[0]);
  });

  it('is reached by Tab, moved with arrow keys and chosen with Enter or Space', async () => {
    const user = userEvent.setup();
    const handleRating = vi.fn();
    render(<RatingWidget isClickable handleRating={handleRating} />);

    await user.tab();
    expect(screen.getByRole('radio', { name: '1 of 5' })).toHaveFocus();

    await user.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}');
    expect(screen.getByRole('radio', { name: '4 of 5' })).toHaveFocus();
    expect(handleRating).not.toHaveBeenCalled();

    await user.keyboard('{Enter}');
    expect(handleRating).toHaveBeenLastCalledWith(4);

    await user.keyboard('{ArrowLeft} ');
    expect(handleRating).toHaveBeenLastCalledWith(3);
  });

  it('keeps a single tab stop and wraps the arrow keys at the ends', async () => {
    const user = userEvent.setup();
    render(<RatingWidget isClickable handleRating={vi.fn()} />);

    await user.tab();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('radio', { name: '5 of 5' })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: '1 of 5' })).toHaveFocus();
    await user.keyboard('{End}');
    expect(screen.getByRole('radio', { name: '5 of 5' })).toHaveFocus();

    expect(screen.getAllByRole('radio').filter((radio) => radio.tabIndex === 0)).toHaveLength(1);
  });

  it('marks the current value as checked', () => {
    render(<RatingWidget isClickable rating={3} handleRating={vi.fn()} />);

    expect(screen.getByRole('radio', { name: '3 of 5' })).toBeChecked();
    expect(screen.getByRole('radio', { name: '3 of 5' })).toHaveAttribute('tabindex', '0');
  });

  it('still saves on click', async () => {
    const user = userEvent.setup();
    const handleRating = vi.fn();
    render(<RatingWidget isClickable handleRating={handleRating} />);

    await user.click(screen.getByRole('radio', { name: '2 of 5' }));

    expect(handleRating).toHaveBeenCalledWith(2);
  });

  it('clears the preview when the mouse leaves after a click, as before', async () => {
    const user = userEvent.setup();
    const { container } = render(<RatingWidget isClickable handleRating={vi.fn()} />);

    await user.click(screen.getByRole('radio', { name: '2 of 5' }));
    expect(container.querySelectorAll('.filledStar')).toHaveLength(2);
    await user.unhover(screen.getByRole('radio', { name: '2 of 5' }));

    expect(container.querySelectorAll('.filledStar')).toHaveLength(0);
  });

  it('keeps the current value filled once the pointer is gone, so a touch choice stays visible', async () => {
    const user = userEvent.setup();
    const { container } = render(<RatingWidget isClickable rating={3} handleRating={vi.fn()} />);

    expect(container.querySelectorAll('.filledStar')).toHaveLength(3);
    await user.hover(screen.getByRole('radio', { name: '5 of 5' }));
    expect(container.querySelectorAll('.filledStar')).toHaveLength(5);
    await user.unhover(screen.getByRole('radio', { name: '5 of 5' }));

    expect(container.querySelectorAll('.filledStar')).toHaveLength(3);
  });

  it('previews the focused value while using the keyboard', async () => {
    const user = userEvent.setup();
    const { container } = render(<RatingWidget isClickable handleRating={vi.fn()} />);

    await user.tab();
    await user.keyboard('{ArrowRight}{ArrowRight}');

    expect(container.querySelectorAll('.filledStar')).toHaveLength(3);
  });

  it('ignores keys and clicks while disabled', async () => {
    const user = userEvent.setup();
    const handleRating = vi.fn();
    render(<RatingWidget isClickable disabled handleRating={handleRating} />);

    expect(ratingGroup()).toHaveAttribute('aria-disabled', 'true');
    await user.click(screen.getByRole('radio', { name: '2 of 5' }));
    await user.keyboard('{Enter}');

    expect(handleRating).not.toHaveBeenCalled();
  });
});

describe('RatingWidget for display', () => {
  it('is not a control and cannot be focused', async () => {
    const user = userEvent.setup();
    const { container } = render(<RatingWidget isClickable={false} rating={3.5} />);

    expect(screen.queryByRole('radiogroup')).not.toBeInTheDocument();
    expect(screen.queryByRole('radio')).not.toBeInTheDocument();
    expect(container.querySelector('[tabindex]')).toBeNull();
    await user.tab();
    expect(document.body).toHaveFocus();
  });
});
