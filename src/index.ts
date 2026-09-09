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

// Lifecycle & Effect Hooks
export { default as useUpdateEffect } from './hooks/useUpdateEffect';
export { default as useInterval } from './hooks/useInterval';
export { default as useIsMounted } from './hooks/useIsMounted';

// Callback & Value Primitives
export { default as useLatest } from './hooks/useLatest';
export { default as useEventCallback } from './hooks/useEventCallback';

// State Helpers
export { default as useToggle } from './hooks/useToggle';
export type { UseToggleActions, UseToggleReturn } from './hooks/useToggle';

// Event & Interaction Hooks
export { default as useEventListener } from './hooks/useEventListener';
export { default as useHover } from './hooks/useHover';
export type { UseHoverReturn } from './hooks/useHover';
export { default as useKeyPress } from './hooks/useKeyPress';
export type { UseKeyPressOptions } from './hooks/useKeyPress';

// Async Hooks
export { default as useAsync } from './hooks/useAsync';
export type { AsyncStatus, UseAsyncReturn } from './hooks/useAsync';

// Collection State Helpers
export { default as useSet } from './hooks/useSet';
export type { UseSetActions, UseSetReturn } from './hooks/useSet';
export { default as useArray } from './hooks/useArray';
export type { UseArrayActions, UseArrayReturn } from './hooks/useArray';
export { default as useControllableState } from './hooks/useControllableState';
export type {
  UseControllableStateParams,
  UseControllableStateReturn,
} from './hooks/useControllableState';

// Async & Data Hooks
export { default as useFetch } from './hooks/useFetch';
export type { UseFetchReturn } from './hooks/useFetch';
export { default as useDebouncedCallback } from './hooks/useDebouncedCallback';
export type { DebouncedCallback } from './hooks/useDebouncedCallback';

// Additional Browser API Hooks
export { default as usePageVisibility } from './hooks/usePageVisibility';
export { default as useOrientation } from './hooks/useOrientation';
export type { OrientationState } from './hooks/useOrientation';
export { default as useBattery } from './hooks/useBattery';
export type { BatteryState } from './hooks/useBattery';
export { default as useGeolocation } from './hooks/useGeolocation';
export type { GeolocationState } from './hooks/useGeolocation';
export { default as useLockBodyScroll } from './hooks/useLockBodyScroll';
