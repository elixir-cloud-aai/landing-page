import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ZoomIn, { ZOOM_IN_DURATION, zoomInKeyframes } from './zoom-in';

describe('ZoomIn', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders its children in one wrapper element', () => {
    render(
      <ZoomIn>
        <p>first</p>
        <p>second</p>
      </ZoomIn>,
    );
    const first = screen.getByText('first');
    expect(first.parentElement).toBe(screen.getByText('second').parentElement);
    expect(first.parentElement?.tagName).toBe('DIV');
  });

  it('starts small and transparent and ends at the resting style', () => {
    expect(ZOOM_IN_DURATION).toBe(1000);
    expect(zoomInKeyframes[0]).toMatchObject({
      offset: 0,
      opacity: 0,
      transform: 'scale3d(0.3, 0.3, 0.3)',
    });
    expect(zoomInKeyframes.at(-1)).toMatchObject({
      offset: 1,
      opacity: 1,
      transform: 'none',
    });
  });
});
