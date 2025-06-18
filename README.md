
<h1 align="center"> react-hook-granth</h1>
<p align="center"><em>A modern, scalable library of 15+ reusable custom React hooks.</em></p>

<p align="center">
  <a href="https://www.npmjs.com/package/react-hook-granth">
    <img alt="npm version" src="https://img.shields.io/npm/v/react-hook-granth?color=blue&label=npm&logo=npm">
  </a>
  <a href="https://www.npmjs.com/package/react-hook-granth">
    <img alt="npm downloads" src="https://img.shields.io/npm/dw/react-hook-granth?color=blueviolet">
  </a>
  <a href="https://www.npmjs.com/package/react-hook-granth">
    <img alt="total downloads" src="https://img.shields.io/npm/dt/react-hook-granth">
  </a>
  <a href="./LICENSE">
    <img alt="license" src="https://img.shields.io/npm/l/react-hook-granth">
  </a>
  <a href="https://www.npmjs.com/package/react-hook-granth">
    <img alt="types" src="https://img.shields.io/npm/types/react-hook-granth?color=orange">
  </a>
</p>

---

## 📦 Install

```bash
npm install react-hook-granth
# or
yarn add react-hook-granth
````

---

## ✨ Why use react-hook-granth?

* ✅ **15+ Custom Hooks** – State, debounce, storage, event listeners, and more
* ⚡ **Lightweight & Performant** – Minimal dependencies, efficient execution
* 🔧 **Plug & Play** – Simple APIs with zero config
* 🧪 **Battle-tested** – Covered by [Vitest](https://vitest.dev) test suite
* 🟨 **JS-first** – TypeScript optional
* 📖 **Documented & Maintained** – Clean docs and actively improved

---

## ⚡ Quick Example

```jsx
import { useCounter } from 'react-hook-granth';

const Counter = () => {
  const { count, increment, decrement, reset } = useCounter(0);

  return (
    <div>
      <h2>{count}</h2>
      <button onClick={increment}>➕</button>
      <button onClick={decrement}>➖</button>
      <button onClick={reset}>🔄</button>
    </div>
  );
};
```

---

## 📚 Included Hooks

Here’s a peek into the powerful hooks you'll get:

| Hook Name          | Description                              |
| ------------------ | ---------------------------------------- |
| `useCounter`       | Manage counters with increment/decrement |
| `useLocalStorage`  | Persist state in localStorage            |
| `usePrevious`      | Track previous value of a state/prop     |
| `useDebounce`      | Debounce changing values or inputs       |
| `useEventListener` | Attach event listeners to any element    |
| `useWindowSize`    | Listen for window dimension changes      |
| *...and more!*     | Additional hooks added regularly 🎯      |

---

## 🧪 Run Tests

```bash
npm test
```

This runs the unit tests with [Vitest](https://vitest.dev) to ensure hooks work reliably.

---

## 🤝 Contribute

We 💙 contributions! Whether it's fixing a bug, adding a new hook, or improving docs — you're welcome to contribute.

### 🔧 Steps:

1. **Fork** this repo
2. **Clone** it locally
3. Create a branch: `git checkout -b feature/my-new-hook`
4. Make changes + write tests
5. Commit and push
6. Submit a **Pull Request**

---

## 📄 License

MIT © [Yuvraj Karna](https://linkedin.com/in/yuvrajkarna27)

---

## 👤 Author

<div align="left">
  <strong>Yuvraj Karna</strong><br />
  🔗 <a href="https://linkedin.com/in/yuvrajkarna27">LinkedIn</a><br />
  🌐 <a href="https://yuvraj-karna.vercel.app">Portfolio</a><br />
  📧 <a href="mailto:yuvrajkarna.code@gmail.com">yuvrajkarna.code@gmail.com</a>
</div>

---

## ⭐️ Show your support

If you find this library helpful, give it a ⭐️ on [GitHub](https://github.com/your-repo)!

---

> Built with ❤️ to save you time and lines of code.


### ✅ Highlights of the new version:
- GitHub-compatible with modern HTML + Markdown styling.
- Clean layout with emoji tags and headers.
- Organized tables and sections for maximum readability.
- Attractive badges and author section.

If you want to:
- Add a demo site (Storybook, Docusaurus)
- Include animated hook usage previews
- Set up GitHub Actions for tests + npm auto-publish

