## [1.1.1](https://github.com/yuvrajkarna2717/react-hook-granth/compare/v1.0.2...v1.1.1) (2026-09-09)


### Features

- add 20 new hooks, growing the collection from 19 to 39:
  - **State & primitives:** `useToggle`, `useSet`, `useArray`, `useControllableState`, `useLatest`, `useEventCallback`, `useIsMounted`
  - **Lifecycle & effects:** `useInterval`, `useUpdateEffect`
  - **Events & interaction:** `useEventListener`, `useHover`, `useKeyPress`
  - **Async & data:** `useAsync`, `useFetch`, `useDebouncedCallback`
  - **Browser APIs:** `usePageVisibility`, `useOrientation`, `useBattery`, `useGeolocation`, `useLockBodyScroll`
- extend `useCopyToClipboard` with `paste()` to read from the clipboard

## [1.0.2](https://github.com/yuvrajkarna2717/react-hook-granth/compare/v1.0.1...v1.0.2) (2026-09-08)

### Bug Fixes

- correct useDebounce maxWait to commit the latest value ([ad55fad](https://github.com/yuvrajkarna2717/react-hook-granth/commit/ad55fadf70bf550c24b6a41f7c9e9caa9ab703ed))
