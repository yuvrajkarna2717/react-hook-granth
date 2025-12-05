import '@testing-library/jest-dom';

// Global clipboard mock
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});
