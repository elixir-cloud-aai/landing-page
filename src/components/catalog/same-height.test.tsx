import { act, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SameHeight } from './same-height';

// jsdom has no layout: each element reports the height in its `data-h`,
// unless a min-height makes it taller
const heights = (element: HTMLElement) => {
  const natural = Number(element.dataset.h);
  const min = parseFloat(element.style.minHeight) || 0;
  return { height: Math.max(natural, min) } as DOMRect;
};

const Cards = ({ h }: { h: [number, number, number] }) => (
  <>
    <div data-h={h[0]} data-same-height="card" data-testid="a" />
    <section>
      <div data-h={h[1]} data-same-height="card" data-testid="b" />
    </section>
    <div data-h={h[2]} data-same-height="other" data-testid="c" />
    <SameHeight group="card" />
  </>
);

describe('SameHeight', () => {
  it('gives the elements of a group the height of the tallest', () => {
    const original = HTMLElement.prototype.getBoundingClientRect;
    HTMLElement.prototype.getBoundingClientRect = function () {
      return heights(this);
    };
    try {
      const { rerender } = render(<Cards h={[300, 340, 500]} />);
      expect(screen.getByTestId('a').style.minHeight).toBe('340px');
      expect(screen.getByTestId('b').style.minHeight).toBe('340px');
      // Another group is left alone
      expect(screen.getByTestId('c').style.minHeight).toBe('');

      // On resize, from the natural heights again (here: both shorter)
      rerender(<Cards h={[200, 250, 500]} />);
      act(() => {
        window.dispatchEvent(new Event('resize'));
      });
      expect(screen.getByTestId('a').style.minHeight).toBe('250px');
      expect(screen.getByTestId('b').style.minHeight).toBe('250px');
    } finally {
      HTMLElement.prototype.getBoundingClientRect = original;
    }
  });

  it('works with any group name and gives heights back on unmount', () => {
    const original = HTMLElement.prototype.getBoundingClientRect;
    HTMLElement.prototype.getBoundingClientRect = function () {
      return heights(this);
    };
    const group = 'say "hi"]';
    try {
      const { rerender } = render(
        <>
          <div data-h={100} data-same-height={group} data-testid="a" />
          <div data-h={150} data-same-height={group} data-testid="b" />
          <SameHeight group={group} />
        </>,
      );
      expect(screen.getByTestId('a').style.minHeight).toBe('150px');

      rerender(
        <>
          <div data-h={100} data-same-height={group} data-testid="a" />
          <div data-h={150} data-same-height={group} data-testid="b" />
        </>,
      );
      expect(screen.getByTestId('a').style.minHeight).toBe('');
      expect(screen.getByTestId('b').style.minHeight).toBe('');
    } finally {
      HTMLElement.prototype.getBoundingClientRect = original;
    }
  });
});
