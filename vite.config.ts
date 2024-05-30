import * as path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@reducer": path.resolve(__dirname, "src/reducer"),
      "@store": path.resolve(__dirname, "src/store"),
      "@selectors": path.resolve(__dirname, "src/selectors"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@components": path.resolve(__dirname, "src/components"),
    }
  }
})
