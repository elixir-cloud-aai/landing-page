import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { createElement, type ImgHTMLAttributes } from 'react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
});

// next/image needs the Next.js runtime; render a plain <img> in tests.
vi.mock('next/image', () => ({
  default: ({
    src,
    alt,
    width,
    height,
    className,
  }: ImgHTMLAttributes<HTMLImageElement>) =>
    createElement('img', { src, alt, width, height, className }),
}));

// Browser APIs that jsdom lacks, used by the animated background and the
// reduced-motion check. They do nothing in tests.
class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
vi.stubGlobal('ResizeObserver', NoopObserver);
vi.stubGlobal('IntersectionObserver', NoopObserver);
vi.stubGlobal(
  'matchMedia',
  (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList,
);
