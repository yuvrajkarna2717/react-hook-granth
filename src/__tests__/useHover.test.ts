import { render, act } from '@testing-library/react';
import { createElement } from 'react';
import { describe, it, expect } from 'vitest';
import useHover from '../hooks/useHover';

describe('useHover', () => {
  it('returns a ref and initial false', () => {
    let hovered: boolean | undefined;
    function Probe() {
      const [ref, isHovered] = useHover<HTMLDivElement>();
      hovered = isHovered;
      return createElement('div', { ref, 'data-testid': 'box' });
    }
    const { getByTestId } = render(createElement(Probe));
    expect(getByTestId('box')).toBeTruthy();
    expect(hovered).toBe(false);
  });

  it('tracks mouseenter / mouseleave', () => {
    let hovered = false;
    function Probe() {
      const [ref, isHovered] = useHover<HTMLDivElement>();
      hovered = isHovered;
      return createElement('div', { ref, 'data-testid': 'box' });
    }
    const { getByTestId } = render(createElement(Probe));
    const box = getByTestId('box');

    act(() => box.dispatchEvent(new MouseEvent('mouseenter')));
    expect(hovered).toBe(true);

    act(() => box.dispatchEvent(new MouseEvent('mouseleave')));
    expect(hovered).toBe(false);
  });
});
