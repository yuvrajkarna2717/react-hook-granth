import { useEffect, useState, useRef, RefObject } from 'react';

export interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

interface UseIntersectionObserverReturn<T extends HTMLElement = HTMLElement> {
  ref: RefObject<T>;
  isIntersecting: boolean;
  entry?: IntersectionObserverEntry;
}

function useIntersectionObserver<T extends HTMLElement = HTMLElement>({
  threshold = 0,
  root = null,
  rootMargin = '0%',
  freezeOnceVisible = false,
}: UseIntersectionObserverOptions = {}): UseIntersectionObserverReturn<T> {
  const ref = useRef<T>(null);
  const [isIntersecting, setIntersecting] = useState<boolean>(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const frozenRef = useRef<boolean>(false);

  useEffect(() => {
    const node = ref.current;
    const hasIOSupport = typeof window !== 'undefined' && !!window.IntersectionObserver;

    if (!hasIOSupport || !node) return;

    // Reset frozen state if options change
    frozenRef.current = false;

    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(([observerEntry]) => {
      // Prevent updates if frozen
      if (frozenRef.current) return;

      const isElementIntersecting = observerEntry.isIntersecting;
      setIntersecting(isElementIntersecting);
      setEntry(observerEntry);

      if (isElementIntersecting && freezeOnceVisible) {
        frozenRef.current = true;
        observer.unobserve(node);
      }
    }, observerParams);

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, freezeOnceVisible]);

  return { ref, isIntersecting, entry };
}

export default useIntersectionObserver;