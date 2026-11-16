import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import ZoomIn from './zoom-in';

const reveal = vi.hoisted(() => vi.fn());

// Records the props that ZoomIn passes and renders the children in one div,
// as Reveal does
vi.mock('react-awesome-reveal', () => ({
  Reveal: ({ children, ...props }: { children: ReactNode }) => {
    reveal(props);
    return <div data-testid="reveal">{children}</div>;
  },
}));

describe('ZoomIn', () => {
  it('renders its children inside Reveal', () => {
    render(
      <ZoomIn>
        <p>first</p>
        <p>second</p>
      </ZoomIn>,
    );
    const wrapper = screen.getByTestId('reveal');
    expect(screen.getByText('first').parentElement).toBe(wrapper);
    expect(screen.getByText('second').parentElement).toBe(wrapper);
  });

  it('passes the zoom entrance of version 4 to Reveal', () => {
    render(<ZoomIn>content</ZoomIn>);
    expect(reveal).toHaveBeenLastCalledWith({
      duration: 1000,
      keyframes: [
        {
          offset: 0,
          easing: 'ease',
          opacity: 0,
          transform: 'scale3d(0.3, 0.3, 0.3)',
        },
        { offset: 0.5, easing: 'ease', opacity: 1 },
        { offset: 1, opacity: 1, transform: 'none' },
      ],
    });
  });
});
