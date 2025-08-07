// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.js'],
    globals: true,
  },
  esbuild: {
    jsx: 'automatic',
  },
});
