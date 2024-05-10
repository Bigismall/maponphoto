import { defineConfig } from 'vite'
import eslintPlugin from "@nabla/vite-plugin-eslint";

export default defineConfig({
  plugins: [eslintPlugin({
    exclude: ['node_modules/**', 'dist/**']
  })],
  base: '/'
})
