import { defineConfig } from 'vite'
import eslint from 'vite-plugin-eslint'
export default defineConfig({
  plugins: [eslint({
    exclude: ['node_modules/**', 'dist/**']
  })],
  base: '/'
})
