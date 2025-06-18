# react-hook-granth: React Custom Hooks Library

A lightweight and easy-to-use collection of 15+ custom React hooks, designed to help you build efficient and scalable React applications. This package is built with JavaScript and comes with pre-written test scripts to ensure reliability.

## Try it out

![version](https://img.shields.io/npm/v/react-hook-granth)
![downloads](https://img.shields.io/npm/dw/react-hook-granth)
![total](https://img.shields.io/npm/dt/react-hook-granth)
![license](https://img.shields.io/npm/l/react-hook-granth)
![types](https://img.shields.io/npm/types/react-hook-granth)


You can try out the package by installing it from npm:

[react-hook-granth on npm](https://www.npmjs.com/package/react-hook-granth)

## Features

- **15+ Custom React Hooks**: A collection of useful hooks to manage state, effects, and more.
- **Lightweight**: Minimal dependencies and a small footprint.
- **Easy to Implement**: Quick setup with straightforward usage.
- **Built with JavaScript**: No need for TypeScript to use, though it can easily be integrated.
- **Pre-written Tests**: Ensure the reliability of each hook with included test scripts.
- **Well-documented**: Clear documentation for each custom hook, along with usage examples.

## Installation

You can install this package via npm:

```bash
npm install react-hook-granth

```

Or if you are using Yarn:

```bash
yarn add react-hook-granth
```

## Usage

Once installed, you can import the hooks from the library and start using them in your React components.

```js
import { useCounter } from 'react-hook-granth';

const Counter = () => {
  const { count, increment, decrement, reset } = useCounter(0);

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
};
```

## Available Hooks

Here’s a list of the hooks available in this package:

- `useCounter`
- `useLocalStorage`
- `usePrevious`
- `useDebounce`
- `useEventListener`
- `useWindowSize`
- And many more...

## Running Tests

This package comes with pre-written test scripts to ensure each hook works as expected. To run the tests, use the following command:

```bash
npm test
```

This will run the test suite using [Vitest](https://vitest.dev/), the testing framework used in this package.

## Contributing

We welcome contributions! Feel free to open issues or submit pull requests with improvements, bug fixes, or additional hooks.

To contribute:

1. Fork the repository.
2. Clone your fork and create a new branch.
3. Make your changes and write tests for new functionality.
4. Submit a pull request with a description of the changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contact

- **Author**: [Yuvraj Karna](https://linkedin.com/in/yuvrajkarna27)
- **Personal Website**: [Visit](https://yuvraj-karna.vercel.app)
- **Email**: yuvrajkarna.code@gmail.com

For questions, feel free to reach out or open an issue in the repository.

### Key Sections:

1. **Features**: Highlights the main benefits of the package (15+ hooks, lightweight, easy to implement).
2. **Installation**: Instructions on how to install the package using npm or Yarn.
3. **Usage**: A simple example showing how to use the hooks.
4. **Available Hooks**: A list of hooks that are part of the library (expandable with your specific hooks).
5. **Running Tests**: Information about the test script and how to run them using Vitest.
6. **Contributing**: A section for developers who want to contribute to the package.
7. **License**: License information.

Feel free to update the sections as needed, such as adding specific details for each custom hook and personal contact details.

```
