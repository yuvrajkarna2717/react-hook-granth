import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import useBattery from '../hooks/useBattery';

afterEach(() => {
  delete (navigator as { getBattery?: unknown }).getBattery;
  vi.restoreAllMocks();
});

describe('useBattery', () => {
  it('reports unsupported when getBattery is missing', () => {
    delete (navigator as { getBattery?: unknown }).getBattery;
    const { result } = renderHook(() => useBattery());
    expect(result.current.supported).toBe(false);
    expect(result.current.loading).toBe(false);
  });

  it('reads the battery state when supported', async () => {
    const battery = {
      level: 0.5,
      charging: true,
      chargingTime: 600,
      dischargingTime: Infinity,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    (navigator as { getBattery?: unknown }).getBattery = vi
      .fn()
      .mockResolvedValue(battery);

    const { result } = renderHook(() => useBattery());
    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current).toMatchObject({
      supported: true,
      level: 0.5,
      charging: true,
      chargingTime: 600,
    });
    // Subscribes to battery events.
    expect(battery.addEventListener).toHaveBeenCalledWith(
      'levelchange',
      expect.any(Function)
    );
  });

  it('unsubscribes battery listeners on unmount', async () => {
    const battery = {
      level: 1,
      charging: false,
      chargingTime: Infinity,
      dischargingTime: 3600,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    (navigator as { getBattery?: unknown }).getBattery = vi
      .fn()
      .mockResolvedValue(battery);

    const { unmount, result } = renderHook(() => useBattery());
    await waitFor(() => expect(result.current.loading).toBe(false));

    unmount();
    expect(battery.removeEventListener).toHaveBeenCalledWith(
      'levelchange',
      expect.any(Function)
    );
  });
});
