import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

const external = ['react', 'react-dom'];

const config = [
  // ESM build: preserve per-hook module boundaries so bundlers can drop
  // unreferenced hooks as whole files (most robust tree-shaking, works even
  // on bundlers that ignore `sideEffects`).
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist/esm',
      format: 'esm',
      preserveModules: true,
      preserveModulesRoot: 'src',
      entryFileNames: '[name].js',
      sourcemap: true,
    },
    plugins: [
      resolve(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationMap: false,
        // Keep the plugin's outDir aligned with the Rollup output dir.
        outDir: 'dist/esm',
      }),
    ],
    external,
  },
  // CommonJS build: a single `.cjs` bundle for `require()` consumers.
  // `.cjs` so Node treats it as CommonJS despite package.json "type": "module".
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    plugins: [
      resolve(),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        declarationMap: false,
        outDir: 'dist',
      }),
    ],
    external,
  },
  // Bundled type definitions.
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'esm',
    },
    plugins: [dts()],
  },
];

export default config;
