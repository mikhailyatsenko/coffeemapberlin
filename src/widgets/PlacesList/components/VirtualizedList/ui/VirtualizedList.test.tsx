import { act, fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type Place } from 'shared/stores/places';
import { VirtualizedList } from './VirtualizedList';

// The real card needs the router, Apollo and the stores; the list only positions it
vi.mock('features/PlaceCard', () => ({
  PlaceCard: ({ index }: { index: number }) => <div>Place {index}</div>,
}));

const places = Array.from(
  { length: 5 },
  (_, i) => ({ id: String(i), properties: {}, geometry: { coordinates: [0, 0] } }) as unknown as Place,
);

const mobileSize = { width: 375, height: 200 };
const desktopSize = { width: 400, height: 800 };

const advance = (ms: number) => {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
};

const getScrollContainer = (container: HTMLElement) => container.querySelector<HTMLElement>('.virtualizedList')!;

describe('VirtualizedList swipe hint (mobile)', () => {
  let scrollTo: ReturnType<typeof vi.fn>;
  let reducedMotion: boolean;

  const renderList = (containerSize = mobileSize) => {
    const result = render(<VirtualizedList places={places} containerSize={containerSize} />);
    advance(0);
    return result;
  };

  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
    reducedMotion = false;
    vi.stubGlobal('innerWidth', 375);
    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)' && reducedMotion,
        media: query,
      })),
    );
    // jsdom has no Element.scrollTo
    scrollTo = vi.fn();
    Element.prototype.scrollTo = scrollTo as unknown as typeof Element.prototype.scrollTo;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    // @ts-expect-error restore jsdom's missing method
    delete Element.prototype.scrollTo;
  });

  it('starts at the left edge, then scrolls to 80px and back to 0 after a second', () => {
    const { container } = renderList();

    expect(getScrollContainer(container).scrollLeft).toBe(0);
    advance(999);
    expect(scrollTo).not.toHaveBeenCalled();

    advance(1);
    expect(scrollTo).toHaveBeenCalledTimes(1);
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 80, behavior: 'smooth' });

    advance(400);
    expect(scrollTo).toHaveBeenCalledTimes(2);
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 0, behavior: 'smooth' });

    advance(5000);
    expect(scrollTo).toHaveBeenCalledTimes(2);
    expect(getScrollContainer(container).scrollLeft).toBe(0);
  });

  it('restores a saved position and plays no hint', () => {
    sessionStorage.setItem('scroll-list', '812');

    const { container } = renderList();

    expect(getScrollContainer(container).scrollLeft).toBe(812);
    advance(5000);
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it('plays no hint when the system asks for reduced motion', () => {
    reducedMotion = true;

    renderList();
    advance(5000);

    expect(scrollTo).not.toHaveBeenCalled();
  });

  it('plays no hint on desktop', () => {
    vi.stubGlobal('innerWidth', 1280);

    renderList(desktopSize);
    advance(5000);

    expect(scrollTo).not.toHaveBeenCalled();
  });

  it('skips the hint when the list was already scrolled', () => {
    const { container } = renderList();
    const list = getScrollContainer(container);

    list.scrollLeft = 150;
    fireEvent.scroll(list);
    advance(5000);

    expect(scrollTo).not.toHaveBeenCalled();
  });

  it.each(['touchStart', 'pointerDown'] as const)('does not pull the list back after a %s during the hint', (event) => {
    const { container } = renderList();
    advance(1000);
    expect(scrollTo).toHaveBeenCalledTimes(1);

    fireEvent[event](getScrollContainer(container));
    advance(5000);

    expect(scrollTo).toHaveBeenCalledTimes(1);
  });

  it('scrolls nothing after unmounting before the hint', () => {
    const { unmount } = renderList();

    advance(500);
    unmount();
    vi.advanceTimersByTime(5000);

    expect(scrollTo).not.toHaveBeenCalled();
  });

  it('scrolls nothing after unmounting during the hint', () => {
    const { unmount } = renderList();

    advance(1000);
    unmount();
    vi.advanceTimersByTime(5000);

    expect(scrollTo).toHaveBeenCalledTimes(1);
  });
});
