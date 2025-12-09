import { useEffect, useState, useRef, useCallback } from 'react';

export interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

export interface UseIntersectionObserverReturn<T extends HTMLElement = HTMLElement> {
  ref: (node: T | null) => void;
  isIntersecting: boolean;
  entry?: IntersectionObserverEntry;
}

function useIntersectionObserver<T extends HTMLElement = HTMLElement>({
  threshold = 0,
  root = null,
  rootMargin = '0%',
  freezeOnceVisible = false,
}: UseIntersectionObserverOptions = {}): UseIntersectionObserverReturn<T> {
  const [node, setNode] = useState<T | null>(null);
  const [isIntersecting, setIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const frozenRef = useRef(false);

  const ref = useCallback((el: T | null) => {
    setNode(el);
  }, []);

  useEffect(() => {
    const hasIOSupport =
      typeof window !== 'undefined' && 'IntersectionObserver' in window;

    if (!hasIOSupport || !node) {
      return;
    }

    frozenRef.current = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (frozenRef.current) return;

        const trackedEntry = entries.find((e) => e.target === node);
        if (!trackedEntry) return;

        const isElementIntersecting = trackedEntry.isIntersecting;
        setIntersecting(isElementIntersecting);
        setEntry(trackedEntry);

        if (isElementIntersecting && freezeOnceVisible) {
          frozenRef.current = true;
          observer.disconnect();
        }
      },
      {
        threshold,
        root,
        rootMargin,
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [node, threshold, root, rootMargin, freezeOnceVisible]);

  return { ref, isIntersecting, entry };
}

export default useIntersectionObserver;
