// State Management Hooks
export { default as useCounter } from './hooks/useCounter';
export type { UseCounterReturn } from './hooks/useCounter';
export { default as useLocalStorage } from './hooks/useLocalStorage';
export type { UseLocalStorageReturn } from './hooks/useLocalStorage';
export { default as useSessionStorage } from './hooks/useSessionStorage';
export type { UseSessionStorageReturn } from './hooks/useSessionStorage';
export { default as usePrevious } from './hooks/usePrevious';

// Performance & Effects Hooks
export { default as useDebounce } from './hooks/useDebounce';
export type {
  UseDebounceOptions,
  UseDebounceReturn,
} from './hooks/useDebounce';
export { default as useThrottle } from './hooks/useThrottle';
export type { UseThrottleReturn } from './hooks/useThrottle';
export { default as useTimeout } from './hooks/useTimeout';
export type { UseTimeoutReturn } from './hooks/useTimeout';
export { default as useIdle } from './hooks/useIdle';

// User Interaction Hooks
export { default as useClickOutside } from './hooks/useClickOutside';
export { default as useCopyToClipboard } from './hooks/useCopyToClipboard';
export type {
  UseCopyToClipboardOptions,
  UseCopyToClipboardReturn,
} from './hooks/useCopyToClipboard';

// Browser API Hooks
export { default as useWindowSize } from './hooks/useWindowSize';
export type { WindowSize } from './hooks/useWindowSize';
export { default as useMediaQuery } from './hooks/useMediaQuery';
export { default as useOnlineStatus } from './hooks/useOnlineStatus';
export { default as useNetworkSpeed } from './hooks/useNetworkSpeed';
export type { NetworkSpeed } from './hooks/useNetworkSpeed';
export { default as useScrollPosition } from './hooks/useScrollPosition';
export type { ScrollPosition } from './hooks/useScrollPosition';
export { default as useScrollIntoView } from './hooks/useScrollIntoView';
export type {
  ScrollIntoViewOptions,
  UseScrollIntoViewReturn,
} from './hooks/useScrollIntoView';
export { default as useIntersectionObserver } from './hooks/useIntersectionObserver';
export type {
  UseIntersectionObserverOptions,
  UseIntersectionObserverReturn,
} from './hooks/useIntersectionObserver';

// Utility Hooks
export { default as useDocumentTitle } from './hooks/useDocumentTitle';
export { default as useMeasure } from './hooks/useMeasure';
export type { Bounds } from './hooks/useMeasure';
