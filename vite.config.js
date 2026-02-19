import { resolve } from 'path'
import { defineConfig } from 'vite'

const pages = [
  'home',
  'about',
  'brand-visual',
  'content-film',
  'growth-marketing',
  'ai-geo',
  'home-copy',
  'our-work',
  'contact',
  'ceo',
  'privacy-policy',
]

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: Object.fromEntries(
        pages.map(page => [page, resolve(__dirname, `src/pages/${page}/main.js`)])
      ),
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: '[name].[ext]',
        format: 'es',
      }
    },
    minify: 'terser'
  }
})