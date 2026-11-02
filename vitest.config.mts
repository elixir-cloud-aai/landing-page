import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Unit and component tests. `npm test` runs them once; `npm run
// test:coverage` also writes coverage/lcov.info for Codecov.
export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  // Next.js leaves JSX to its own compiler (tsconfig "jsx": "preserve"), so
  // tell esbuild to compile it here.
  esbuild: { jsx: 'automatic' },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'lcov'],
      reportsDirectory: 'coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/test/**', 'src/**/*.d.ts'],
    },
  },
});
