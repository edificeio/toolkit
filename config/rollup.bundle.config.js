import typescript from 'rollup-plugin-typescript'
import uglify from 'rollup-plugin-uglify'

export default {
    entry: './src/index.ts',
    dest: './dist/bundle/toolkit.umd.js',
    format: 'umd',
    moduleName: 'toolkit',
    sourceMap: true,
    globals: {
        axios: 'axios'
    },
    plugins: [
        typescript({
            typescript: require('typescript'),
            tsconfig: false,
            emitDecoratorMetadata: true,
            experimentalDecorators: true,
            sourceMap: true
        }),
        uglify()
    ]
}