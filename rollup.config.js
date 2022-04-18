import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import babel from '@rollup/plugin-babel';
import eslint from '@rollup/plugin-eslint';

import pkg from './package.json';

const input = ['src/index.js'];

export default [
    {
        // UMD
        input,
        plugins: [
            eslint(),
            nodeResolve(),
            babel({
                babelHelpers: 'bundled',
            }),
            terser(),
        ],
        output: {
            file: `dist/${pkg.name}.min.js`,
            format: 'umd',
            name: 'UserIntent',
            esModule: false,
            exports: 'named',
            sourcemap: true,
            footer: 'window.UserIntent = window.UserIntent.default;',
        },
    },

    // ESM and CJS
    {
        input,
        plugins: [eslint(), nodeResolve()],
        output: [
            {
                dir: 'dist/esm',
                format: 'esm',
                exports: 'named',
                sourcemap: true,
            },
            {
                dir: 'dist/cjs',
                format: 'cjs',
                exports: 'named',
                sourcemap: true,
            },
        ],
    },
];
