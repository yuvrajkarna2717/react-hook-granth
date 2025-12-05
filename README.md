<h1 align="center">🪝 React Hook Granth</h1>
<p align="center"><em>A collection of reusable custom React hooks for efficient development</em></p>

<p align="center">
  <a href="https://www.npmjs.com/package/react-hook-granth">
    <img alt="npm version" src="https://img.shields.io/npm/v/react-hook-granth?color=blue&label=npm&logo=npm">
  </a>
  <a href="https://www.npmjs.com/package/react-hook-granth">
    <img alt="npm downloads" src="https://img.shields.io/npm/dw/react-hook-granth?color=blueviolet">
  </a>
  <a href="./LICENSE">
    <img alt="license" src="https://img.shields.io/npm/l/react-hook-granth">
  </a>
  <a href="https://github.com/yuvrajkarna2717/react-hook-granth/issues">
    <img alt="issues" src="https://img.shields.io/github/issues/yuvrajkarna2717/react-hook-granth">
  </a>
  <a href="https://github.com/yuvrajkarna2717/react-hook-granth/stargazers">
    <img alt="stars" src="https://img.shields.io/github/stars/yuvrajkarna2717/react-hook-granth">
  </a>
</p>

## 📦 Installation

```
# npm
npm install react-hook-granth

# yarn
yarn add react-hook-granth

# pnpm
pnpm add react-hook-granth
```

---

## ✨ Features

- 🪝 **Custom React Hooks** – Counter, debounce, storage, event listeners, and more
- ⚡ **Lightweight** – Zero dependencies, tree-shakable
- 📦 **TypeScript Support** – Full type definitions included
- 🧪 **Well Tested** – Comprehensive test coverage
- 📖 **Well Documented** – Clear examples and API documentation

## 🚀 Quick Start

```jsx
import { useCounter, useLocalStorage, useDebounce } from 'react-hook-granth';

function App() {
  const { count, increment, decrement, reset } = useCounter(0);
  const [name, setName] = useLocalStorage('username', '');
  const debouncedName = useDebounce(name, 300);

  return (
    <div>
      <div>
        <p>Count: {count}</p>
        <button onClick={increment}>➕ Increment</button>
        <button onClick={decrement}>➖ Decrement</button>
        <button onClick={reset}>🔄 Reset</button>
      </div>
      
      <div>
        <input 
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
        <p>Debounced: {debouncedName}</p>
      </div>
    </div>
  );
}

---

## 📚 Available Hooks

### 🔢 State Management

| Hook              | Description                         | Example                          |
| ----------------- | ----------------------------------- | -------------------------------- |
| `useCounter`      | Increment, decrement, reset counter | [View Example](#usecounter)      |
| `useLocalStorage` | Persist state in localStorage       | [View Example](#uselocalstorage) |
| `usePrevious`     | Track previous value of state/prop  | [View Example](#useprevious)     |

### ⚡ Performance & Effects

| Hook                | Description                      | Example                            |
| ------------------- | -------------------------------- | ---------------------------------- |
| `useDebounce`       | Debounce rapidly changing values | [View Example](#usedebounce)       |
| `useScrollIntoView` | Auto-scroll element into view    | [View Example](#usescrollintoview) |

### 🖱️ User Interactions

| Hook                 | Description                   | Example                             |
| -------------------- | ----------------------------- | ----------------------------------- |
| `useClickOutside`    | Detect clicks outside element | [View Example](#useclickoutside)    |
| `useCopyToClipboard` | Copy text to clipboard        | [View Example](#usecopytoclipboard) |
| `useEventListener`   | Attach event listeners safely | Coming Soon                         |

### 🌐 Browser APIs

| Hook            | Description             | Example     |
| --------------- | ----------------------- | ----------- |
| `useWindowSize` | Track window dimensions | Coming Soon |

---

## 📖 Hook Examples

### useCounter

```jsx
import { useCounter } from 'react-hook-granth';

function CounterExample() {
  const { count, increment, decrement, reset } = useCounter(10);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset to 10</button>
    </div>
  );
}
```

### useDebounce

```jsx
import { useState } from 'react';
import { useDebounce } from 'react-hook-granth';

function SearchExample() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedValue = useDebounce(searchTerm, 300);

  return (
    <div>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
      <p>Debounced: {debouncedValue}</p>
    </div>
  );
}
```

### useLocalStorage

```jsx
import { useLocalStorage } from 'react-hook-granth';

function SettingsExample() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  return (
    <div>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Current theme: {theme}
      </button>
    </div>
  );
}
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

---

## 🚀 Production Ready

### ✅ **Production Features:**
- **TypeScript Support** - Full type definitions
- **Tree Shaking** - Import only what you need
- **SSR Compatible** - Works with Next.js, Gatsby, etc.
- **Zero Dependencies** - No external runtime dependencies
- **Comprehensive Tests** - 100% test coverage
- **Multiple Formats** - ESM and CommonJS builds

### 📦 **Build & Distribution:**
```bash
# Build for production
npm run build

# Clean build artifacts
npm run clean
```

### 🔧 **Bundle Sizes:**
- **Total Bundle**: ~4.2KB minified + gzipped
- **Individual Hooks**: 0.5KB - 1.2KB each
- **Tree-shakable**: Import only what you use

### 🌐 **SSR Support:**
All hooks are SSR-safe and work with:
- Next.js
- Gatsby
- Remix
- Any SSR framework

---

---

## 🤝 Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding new hooks, or improving documentation, your help is appreciated.

### 🚀 Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/react-hook-granth.git
   cd react-hook-granth
   ```
3. **Install** dependencies:
   ```bash
   npm install
   ```
4. **Create** a new branch for your feature:
   ```bash
   git checkout -b feature/your-hook-name
   ```

### 📝 Development Guidelines

#### Adding a New Hook

1. **Create the hook** in `src/hooks/`:
   ```typescript
   // src/hooks/useYourHook.ts
   import { useState, useEffect } from 'react';
   
   export function useYourHook(initialValue: any) {
     // Your hook implementation
     return { /* your return values */ };
   }
   ```

2. **Export it** from `src/index.ts`:
   ```typescript
   export { useYourHook } from './hooks/useYourHook';
   ```

3. **Add TypeScript types** (if needed) in `src/types/`

4. **Write tests** (optional but encouraged) in `src/__tests__/`:
   ```typescript
   // src/__tests__/useYourHook.test.ts
   import { renderHook } from '@testing-library/react';
   import { useYourHook } from '../hooks/useYourHook';
   
   describe('useYourHook', () => {
     it('should work correctly', () => {
       const { result } = renderHook(() => useYourHook('test'));
       expect(result.current).toBeDefined();
     });
   });
   ```

5. **Update documentation** by adding your hook to the README.md

#### Code Standards

- **TypeScript**: All hooks should be written in TypeScript with proper type definitions
- **ESLint**: Follow the existing ESLint configuration
- **Naming**: Use descriptive names starting with `use` (e.g., `useLocalStorage`, `useDebounce`)
- **Documentation**: Include JSDoc comments for better IntelliSense

#### Testing (Optional but Encouraged)

While tests are not mandatory, they help ensure code quality and prevent regressions:

- Use **Jest** and **React Testing Library**
- Test edge cases and error scenarios
- Aim for good coverage of your hook's functionality
- Run tests with: `npm test`

### 🔄 Pull Request Process

1. **Ensure** your code follows the project's coding standards
2. **Update** the README.md with details of your new hook (if applicable)
3. **Test** your changes thoroughly
4. **Commit** your changes with clear, descriptive messages:
   ```bash
   git commit -m "feat: add useYourHook for handling X functionality"
   ```
5. **Push** to your fork:
   ```bash
   git push origin feature/your-hook-name
   ```
6. **Create** a Pull Request with:
   - Clear title and description
   - Reference any related issues
   - Screenshots or examples (if applicable)

### 🎯 Contribution Ideas

Looking for ways to contribute? Here are some ideas:

#### New Hooks
- `useMediaQuery` - Responsive design helper
- `useIntersectionObserver` - Visibility detection
- `useFetch` - Data fetching with caching
- `useForm` - Form state management
- `useKeyboard` - Keyboard shortcuts
- `useGeolocation` - Browser geolocation API
- `useOnlineStatus` - Network status detection
- `useIdle` - User idle detection

#### Improvements
- **Bug fixes** for existing hooks
- **Performance optimizations**
- **Better TypeScript types**
- **Documentation improvements**
- **Example applications**
- **Test coverage** for existing hooks

### 💬 Getting Help

- **Issues**: Open an issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Code Review**: Maintainers will review your PR and provide feedback

### 🏆 Recognition

All contributors will be:
- Added to the contributors list
- Mentioned in release notes
- Given credit in the documentation

Thank you for helping make React Hook Granth better! 🙏

---

## 📈 Roadmap

Want to see what's coming next? Check out our [GitHub Issues](https://github.com/yuvrajkarna2717/react-hook-granth/issues) for planned features and improvements.

### Help Us Prioritize

Vote on existing issues or create new ones to help us understand what the community needs most!

---

## 📄 License

MIT © [Yuvraj Karna](https://github.com/yuvrajkarna2717)

---

## ⭐️ Show Your Support

If this library helps you, please consider:

- ⭐️ **Star** the [repository](https://github.com/yuvrajkarna2717/react-hook-granth)
- 🐛 **Report** issues or suggest improvements
- 💡 **Contribute** new hooks or improvements
- 📢 **Share** it with other developers

---

**Built with ❤️ for the React community**
