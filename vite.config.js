import { resolve } from 'path'
import { defineConfig } from 'vite'

const page = process.env.PAGE

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: resolve(__dirname, `src/pages/${page}/main.js`),
      output: {
        format: 'iife',
        name: 'Aurix_' + page.replace(/-/g, '_'),
        entryFileNames: `${page}.js`,
        assetFileNames: '[name].[ext]',
        dir: 'dist',
      }
    },
    minify: 'terser'
  }
})