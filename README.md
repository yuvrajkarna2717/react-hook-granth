# react-hook-granth

A collection of custom React hooks for state management, browser APIs, and common UI logic. Written in TypeScript, ships ESM and CommonJS builds, and is tree-shakeable so you only bundle the hooks you import.

[![npm version](https://img.shields.io/npm/v/react-hook-granth?color=blue&label=npm&logo=npm)](https://www.npmjs.com/package/react-hook-granth)
[![total downloads](https://img.shields.io/npm/dt/react-hook-granth?color=blueviolet&label=downloads)](https://www.npmjs.com/package/react-hook-granth)
[![license](https://img.shields.io/npm/l/react-hook-granth)](./LICENSE)

## Features

- 20 focused, composable hooks with full TypeScript types.
- Zero runtime dependencies; `react` and `react-dom` are peer dependencies.
- Dual ESM/CJS output with per-hook ES modules and `"sideEffects": false` for effective tree-shaking.
- SSR-safe: hooks that touch `window`, `document`, or `navigator` guard against server rendering.

## Requirements

- React `>= 16.8.0` (hooks support).

## Installation

```bash
npm install react-hook-granth
# or
yarn add react-hook-granth
# or
pnpm add react-hook-granth
```

## Usage

Import named hooks from the package root. Only the hooks you import are included in your bundle.

```tsx
import { useCounter, useLocalStorage, useDebounce } from 'react-hook-granth';

function Example() {
  const { count, increment, decrement, reset } = useCounter(0);
  const [name, setName] = useLocalStorage('name', '');
  const { debouncedValue } = useDebounce(name, 300);

  return (
    <div>
      <p>{count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>reset</button>

      <input value={name} onChange={(e) => setName(e.target.value)} />
      <p>Debounced: {debouncedValue}</p>
    </div>
  );
}
```

Both module systems are supported:

```ts
import { useCounter } from 'react-hook-granth'; // ESM
const { useCounter } = require('react-hook-granth'); // CommonJS
```

## API

All hooks are named exports. Public option/return types are exported alongside each hook.

### State management

#### `useCounter(initialValue?: number | null): UseCounterReturn`

Manages a numeric counter. `null`/`undefined` are treated as `0`. Returns `{ count, increment, decrement, reset }` with stable callbacks. `reset` returns to the initial value.

```ts
const { count, increment, decrement, reset } = useCounter(10);
```

#### `useLocalStorage<T>(key, initialValue): [T, Dispatch<SetStateAction<T>>]`

Syncs state with `localStorage`. The setter accepts a value or an updater function, like `useState`. SSR-safe, and read/write failures (including invalid stored JSON) fall back to `initialValue` without throwing.

```ts
const [theme, setTheme] = useLocalStorage('theme', 'light');
setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
```

#### `useSessionStorage<T>(key, initialValue): [T, Dispatch<SetStateAction<T>>]`

Same contract as `useLocalStorage`, backed by `sessionStorage`.

#### `usePrevious<T>(value: T): T | undefined`

Returns the value from the previous render; `undefined` on the first render.

```ts
const previousCount = usePrevious(count);
```

### Performance & effects

#### `useDebounce<T>(value, delay?, options?): UseDebounceReturn<T>`

Debounces a changing value. `delay` defaults to `300` ms. Returns `{ debouncedValue, cancel, flush, isPending }`.

`UseDebounceOptions<T>`:

| Option       | Type                 | Default | Description                                   |
| ------------ | -------------------- | ------- | --------------------------------------------- |
| `leading`    | `boolean`            | `false` | Commit on the leading edge.                   |
| `trailing`   | `boolean`            | `true`  | Commit on the trailing edge.                  |
| `maxWait`    | `number`             | —       | Force a commit after this many ms.            |
| `onDebounce` | `(value: T) => void` | —       | Called when the debounced value is committed. |
| `onCancel`   | `() => void`         | —       | Called when a pending debounce is cancelled.  |

```ts
const { debouncedValue, isPending, cancel, flush } = useDebounce(query, 300);
```

#### `useThrottle<T extends (...args) => any>(callback, delay): (...args) => void`

Returns a throttled callback that runs at most once per `delay` ms. The leading call fires immediately; a trailing call fires at the end of the window with the most recent arguments, so the final call in a burst is not dropped. The pending trailing call is cleared on unmount.

```ts
const onScroll = useThrottle(handleScroll, 200);
```

#### `useTimeout(callback, delay): UseTimeoutReturn`

Runs `callback` after `delay` ms and restarts when `delay` changes. Returns `{ clear, reset }` to cancel or restart the timer. Cleans up on unmount.

```ts
const { clear, reset } = useTimeout(() => save(), 1000);
```

#### `useIdle(timeout?: number): boolean`

Returns `true` after `timeout` ms (default `3000`) with no user activity. Resets on `mousemove`, `mousedown`, `keydown`, `scroll`, and `touchstart`. SSR-safe.

```ts
const isIdle = useIdle(5000);
```

### User interaction

#### `useClickOutside<T extends HTMLElement>(handler): RefObject<T | null>`

Returns a ref to attach to an element. `handler` is called on `mousedown`/`touchstart` outside that element. The latest handler is always used without re-attaching listeners.

```tsx
const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));
return <div ref={ref} />;
```

#### `useCopyToClipboard(options?): UseCopyToClipboardReturn`

Copies text via the async Clipboard API. Returns `{ isCopied, copy, reset }`, where `copy(text)` resolves to a `boolean`. `isCopied` auto-resets after `resetTime` ms.

`UseCopyToClipboardOptions`:

| Option      | Type                     | Default | Description                     |
| ----------- | ------------------------ | ------- | ------------------------------- |
| `resetTime` | `number`                 | `2000`  | Delay before `isCopied` resets. |
| `onSuccess` | `() => void`             | —       | Called after a successful copy. |
| `onError`   | `(error: Error) => void` | —       | Called when copying fails.      |

```ts
const { isCopied, copy } = useCopyToClipboard({ resetTime: 1500 });
await copy('hello');
```

### Browser APIs

#### `useWindowSize(): WindowSize`

Returns `{ width, height }` and updates on `resize`. Returns `{ width: 0, height: 0 }` during SSR.

#### `useMediaQuery(query: string): boolean`

Returns whether a CSS media query currently matches, updating on change. Returns `false` during SSR.

```ts
const isDesktop = useMediaQuery('(min-width: 1024px)');
```

#### `useOnlineStatus(): boolean`

Returns the browser online status, updating on `online`/`offline`. Assumes online during SSR.

#### `useNetworkSpeed(): NetworkSpeed`

Returns `{ connectionType, downlink }` from the Network Information API, updating on the connection's `change` event and on `online`/`offline`. Falls back to `{ connectionType: 'unknown', downlink: 0 }` when the API is unavailable.

#### `useScrollPosition(): ScrollPosition`

Returns `{ x, y }` window scroll offsets, updating on `scroll`. Returns `{ x: 0, y: 0 }` during SSR.

#### `useScrollIntoView<T extends HTMLElement>(ref, triggers?, delay?, options?, onScrollComplete?): UseScrollIntoViewReturn`

Scrolls `ref` into view when any truthy value in `triggers` changes, or manually via the returned `scrollToElement`. `delay` defaults to `100` ms; `options` are standard `scrollIntoView` options. Returns `{ hasScrolled, error, scrollToElement }`.

```ts
const ref = useRef<HTMLDivElement>(null);
const { scrollToElement, hasScrolled, error } = useScrollIntoView(ref, [open]);
```

#### `useIntersectionObserver<T extends HTMLElement>(options?): UseIntersectionObserverReturn<T>`

Observes element visibility with `IntersectionObserver`. Returns `{ ref, isIntersecting, entry }`; attach `ref` to the target element. SSR-safe.

`UseIntersectionObserverOptions` extends `IntersectionObserverInit` with:

| Option              | Type      | Default | Description                                     |
| ------------------- | --------- | ------- | ----------------------------------------------- |
| `freezeOnceVisible` | `boolean` | `false` | Stop observing after the element first appears. |

```tsx
const { ref, isIntersecting } = useIntersectionObserver({ threshold: 0.5 });
return <div ref={ref}>{isIntersecting ? 'visible' : 'hidden'}</div>;
```

### Utility

#### `useDocumentTitle(title: string): void`

Sets `document.title` whenever `title` changes.

#### `useMeasure<T extends HTMLElement>(): [RefObject<T | null>, Bounds]`

Returns a `ref` and the element's `{ width, height }`. Re-measures on window resize and, where supported, on element resize via `ResizeObserver`.

```tsx
const [ref, { width, height }] = useMeasure<HTMLDivElement>();
return <div ref={ref} />;
```

## Package format

| Field         | Value               |
| ------------- | ------------------- |
| `main` (CJS)  | `dist/index.cjs`    |
| `module`(ESM) | `dist/esm/index.js` |
| `types`       | `dist/index.d.ts`   |
| `sideEffects` | `false`             |

The ESM build preserves per-hook module boundaries (`dist/esm/hooks/*.js`), so bundlers drop unused hooks entirely.

## Development

```bash
npm install
npm run build        # rollup -> dist (ESM per-module, CJS bundle, .d.ts)
npm run test:run     # run the test suite once (Vitest + jsdom)
npm run type-check   # tsc --noEmit on source
npm run lint         # ESLint
npm run check        # type-check + type-check:test + lint + format:check + tests
```

## Contributing

Issues and pull requests are welcome. Please run `npm run check` before opening a PR.

## License

MIT © [Yuvraj Karna](https://github.com/yuvrajkarna2717)
