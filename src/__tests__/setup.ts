import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Global clipboard mock shared across tests.
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});
