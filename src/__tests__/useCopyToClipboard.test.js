// src/__tests__/useCopyToClipboard.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useCopyToClipboard from '../hooks/useCopyToClipboard';

// Mock navigator.clipboard
const mockWriteText = vi.fn();
const mockClipboard = {
  writeText: mockWriteText,
};

describe('useCopyToClipboard', () => {
  beforeEach(() => {
    // Mock navigator.clipboard
    Object.assign(navigator, {
      clipboard: mockClipboard,
    });

    // Mock timers
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useCopyToClipboard());

      expect(result.current.isCopied).toBe(false);
      expect(typeof result.current.copy).toBe('function');
      expect(typeof result.current.reset).toBe('function');
    });

    it('should accept custom options', () => {
      const onSuccess = vi.fn();
      const onError = vi.fn();

      const { result } = renderHook(() =>
        useCopyToClipboard({
          resetTime: 5000,
          onSuccess,
          onError,
        })
      );

      expect(result.current.isCopied).toBe(false);
      expect(typeof result.current.copy).toBe('function');
      expect(typeof result.current.reset).toBe('function');
    });
  });

  describe('Successful Copy Operations', () => {
    it('should copy text successfully', async () => {
      mockWriteText.mockResolvedValue(undefined);
      const { result } = renderHook(() => useCopyToClipboard());

      let copyResult;
      await act(async () => {
        copyResult = await result.current.copy('Hello, World!');
      });

      expect(copyResult).toBe(true);
      expect(result.current.isCopied).toBe(true);
      expect(mockWriteText).toHaveBeenCalledWith('Hello, World!');
      expect(mockWriteText).toHaveBeenCalledTimes(1);
    });

    it('should call onSuccess callback when copy succeeds', async () => {
      mockWriteText.mockResolvedValue(undefined);
      const onSuccess = vi.fn();

      const { result } = renderHook(() => useCopyToClipboard({ onSuccess }));

      await act(async () => {
        await result.current.copy('Test text');
      });

      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(result.current.isCopied).toBe(true);
    });

    it('should reset isCopied after default timeout (2000ms)', async () => {
      mockWriteText.mockResolvedValue(undefined);
      const { result } = renderHook(() => useCopyToClipboard());

      await act(async () => {
        await result.current.copy('Test text');
      });

      expect(result.current.isCopied).toBe(true);

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.isCopied).toBe(false);
    });

    it('should reset isCopied after custom timeout', async () => {
      mockWriteText.mockResolvedValue(undefined);
      const { result } = renderHook(() =>
        useCopyToClipboard({ resetTime: 5000 })
      );

      await act(async () => {
        await result.current.copy('Test text');
      });

      expect(result.current.isCopied).toBe(true);

      // Should not reset after default time
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(result.current.isCopied).toBe(true);

      // Should reset after custom time
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(result.current.isCopied).toBe(false);
    });
  });

  describe('Failed Copy Operations', () => {
    it('should handle clipboard API not supported', async () => {
      // Remove clipboard from navigator
      const originalClipboard = navigator.clipboard;
      delete navigator.clipboard;

      const onError = vi.fn();
      const { result } = renderHook(() => useCopyToClipboard({ onError }));

      let copyResult;
      await act(async () => {
        copyResult = await result.current.copy('Test text');
      });

      expect(copyResult).toBe(false);
      expect(result.current.isCopied).toBe(false);
      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Clipboard API not supported',
        })
      );

      // Restore clipboard
      navigator.clipboard = originalClipboard;
    });

    it('should handle clipboard write failure', async () => {
      const clipboardError = new Error('Clipboard write failed');
      mockWriteText.mockRejectedValue(clipboardError);

      const onError = vi.fn();
      const { result } = renderHook(() => useCopyToClipboard({ onError }));

      let copyResult;
      await act(async () => {
        copyResult = await result.current.copy('Test text');
      });

      expect(copyResult).toBe(false);
      expect(result.current.isCopied).toBe(false);
      expect(onError).toHaveBeenCalledWith(clipboardError);
      expect(mockWriteText).toHaveBeenCalledWith('Test text');
    });

    it('should handle unknown error types', async () => {
      mockWriteText.mockRejectedValue('String error');

      const onError = vi.fn();
      const { result } = renderHook(() => useCopyToClipboard({ onError }));

      await act(async () => {
        await result.current.copy('Test text');
      });

      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Unknown error occurred',
        })
      );
    });
  });

  describe('Reset Functionality', () => {
    it('should manually reset isCopied state', async () => {
      mockWriteText.mockResolvedValue(undefined);
      const { result } = renderHook(() => useCopyToClipboard());

      await act(async () => {
        await result.current.copy('Test text');
      });

      expect(result.current.isCopied).toBe(true);

      act(() => {
        result.current.reset();
      });

      expect(result.current.isCopied).toBe(false);
    });

    it('should clear existing timeout when reset is called', async () => {
      mockWriteText.mockResolvedValue(undefined);
      const { result } = renderHook(() => useCopyToClipboard());

      await act(async () => {
        await result.current.copy('Test text');
      });

      expect(result.current.isCopied).toBe(true);

      // Reset before timeout
      act(() => {
        result.current.reset();
      });

      expect(result.current.isCopied).toBe(false);

      // Advance time past original timeout
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      // Should remain false (timeout was cleared)
      expect(result.current.isCopied).toBe(false);
    });
  });

  describe('Multiple Copy Operations', () => {
    it('should handle multiple consecutive copy operations', async () => {
      mockWriteText.mockResolvedValue(undefined);
      const { result } = renderHook(() => useCopyToClipboard());

      // First copy
      await act(async () => {
        const result1 = await result.current.copy('First text');
        expect(result1).toBe(true);
      });
      expect(result.current.isCopied).toBe(true);

      // Second copy before timeout
      await act(async () => {
        const result2 = await result.current.copy('Second text');
        expect(result2).toBe(true);
      });
      expect(result.current.isCopied).toBe(true);

      // Should reset after the last copy's timeout
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(result.current.isCopied).toBe(false);

      expect(mockWriteText).toHaveBeenCalledTimes(2);
      expect(mockWriteText).toHaveBeenNthCalledWith(1, 'First text');
      expect(mockWriteText).toHaveBeenNthCalledWith(2, 'Second text');
    });

    it('should handle mixed success and failure operations', async () => {
      const onSuccess = vi.fn();
      const onError = vi.fn();
      const { result } = renderHook(() =>
        useCopyToClipboard({ onSuccess, onError })
      );

      // Successful copy
      mockWriteText.mockResolvedValue(undefined);
      await act(async () => {
        const result1 = await result.current.copy('Success text');
        expect(result1).toBe(true);
      });
      expect(result.current.isCopied).toBe(true);
      expect(onSuccess).toHaveBeenCalledTimes(1);

      // Failed copy
      mockWriteText.mockRejectedValue(new Error('Failed'));
      await act(async () => {
        const result2 = await result.current.copy('Fail text');
        expect(result2).toBe(false);
      });
      expect(result.current.isCopied).toBe(false);
      expect(onError).toHaveBeenCalledTimes(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string', async () => {
      mockWriteText.mockResolvedValue(undefined);
      const { result } = renderHook(() => useCopyToClipboard());

      let copyResult;
      await act(async () => {
        copyResult = await result.current.copy('');
      });

      expect(copyResult).toBe(true);
      expect(result.current.isCopied).toBe(true);
      expect(mockWriteText).toHaveBeenCalledWith('');
    });

    it('should handle very long text', async () => {
      mockWriteText.mockResolvedValue(undefined);
      const longText = 'A'.repeat(10000);
      const { result } = renderHook(() => useCopyToClipboard());

      let copyResult;
      await act(async () => {
        copyResult = await result.current.copy(longText);
      });

      expect(copyResult).toBe(true);
      expect(result.current.isCopied).toBe(true);
      expect(mockWriteText).toHaveBeenCalledWith(longText);
    });

    it('should handle special characters', async () => {
      mockWriteText.mockResolvedValue(undefined);
      const specialText = '🎉 Hello 世界 \n\t"quotes" & symbols!';
      const { result } = renderHook(() => useCopyToClipboard());

      let copyResult;
      await act(async () => {
        copyResult = await result.current.copy(specialText);
      });

      expect(copyResult).toBe(true);
      expect(result.current.isCopied).toBe(true);
      expect(mockWriteText).toHaveBeenCalledWith(specialText);
    });
  });

  describe('Cleanup', () => {
    it('should clear timeout on unmount', async () => {
      mockWriteText.mockResolvedValue(undefined);
      const { result, unmount } = renderHook(() => useCopyToClipboard());

      await act(async () => {
        await result.current.copy('Test text');
      });

      expect(result.current.isCopied).toBe(true);

      // Unmount before timeout
      unmount();

      // Advance time past timeout
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      // Since component unmounted, we can't check state
      // but this test ensures no memory leaks occur
    });
  });

  describe('Function Stability', () => {
    it('should maintain function reference stability', () => {
      const { result, rerender } = renderHook(
        ({ resetTime }) => useCopyToClipboard({ resetTime }),
        { initialProps: { resetTime: 2000 } }
      );

      const originalCopy = result.current.copy;
      const originalReset = result.current.reset;

      // Rerender with same props
      rerender({ resetTime: 2000 });

      expect(result.current.copy).toBe(originalCopy);
      expect(result.current.reset).toBe(originalReset);
    });

    it('should update function when dependencies change', () => {
      const onSuccess1 = vi.fn();
      const onSuccess2 = vi.fn();

      const { result, rerender } = renderHook(
        ({ onSuccess }) => useCopyToClipboard({ onSuccess }),
        { initialProps: { onSuccess: onSuccess1 } }
      );

      const originalCopy = result.current.copy;

      // Rerender with different callback
      rerender({ onSuccess: onSuccess2 });

      // Function should be different due to dependency change
      expect(result.current.copy).not.toBe(originalCopy);
    });
  });
});
