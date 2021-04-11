import { terser } from 'rollup-plugin-terser'
import { babel } from '@rollup/plugin-babel'
import typescript from '@rollup/plugin-typescript'

export default [
    {
        input: 'fps.ts',
        plugins: [
            typescript({
            }),
            terser(),
            babel({
                babelHelpers: 'bundled',
                presets: ['@babel/preset-env']
            }),
        ],
        output: {
            file: 'dist/fps.min.js',
            format: 'umd',
            name: 'FPS',
            sourcemap: true
        }
    },
    {
        input: 'fps.ts',
        plugins: [
            typescript()
        ],
        output: {
            file: 'dist/fps.es.js',
            format: 'esm',
            sourcemap: true
        }
    }]