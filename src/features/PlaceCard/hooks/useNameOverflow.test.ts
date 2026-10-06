import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useNameOverflow } from './useNameOverflow';

const nameElement = (scrollWidth: number, clientWidth: number) => {
  const element = document.createElement('h4');
  Object.defineProperty(element, 'scrollWidth', { configurable: true, value: scrollWidth });
  Object.defineProperty(element, 'clientWidth', { configurable: true, value: clientWidth });
  return { current: element };
};

describe('useNameOverflow', () => {
  it('re-measures when the card is reused for another name', async () => {
    const ref = nameElement(180, 256);
    const { result, rerender } = renderHook(({ name }) => useNameOverflow(ref, name), {
      initialProps: { name: 'Short' },
    });
    await waitFor(() => {
      expect(result.current).toBe(0);
    });

    Object.defineProperty(ref.current, 'scrollWidth', { configurable: true, value: 300 });
    rerender({ name: 'A much longer place name' });

    await waitFor(() => {
      expect(result.current).toBe(44);
    });
  });

  it('returns how many px the name is wider than its box, even by a couple of px', async () => {
    const { result } = renderHook(() => useNameOverflow(nameElement(258, 256), 'name'));

    await waitFor(() => {
      expect(result.current).toBe(2);
    });
  });

  it('returns 0 when the name fits its box', async () => {
    const { result } = renderHook(() => useNameOverflow(nameElement(180, 256), 'name'));

    await waitFor(() => {
      expect(result.current).toBe(0);
    });
  });
});
