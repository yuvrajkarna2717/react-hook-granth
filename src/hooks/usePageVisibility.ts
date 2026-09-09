import { useEffect, useState } from 'react';

/**
 * Track whether the page/tab is currently visible (Page Visibility API).
 *
 * Useful for pausing polling, animations, or video when the tab is
 * backgrounded. Returns `true` during SSR.
 * @returns `true` when the document is visible, `false` when hidden.
 */
export default function usePageVisibility(): boolean {
  const [visible, setVisible] = useState<boolean>(() => {
    if (typeof document === 'undefined') return true;
    return document.visibilityState !== 'hidden';
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const onChange = () => setVisible(document.visibilityState !== 'hidden');
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);

  return visible;
}
