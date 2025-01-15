import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@main": path.resolve(__dirname, "src/main.tsx"),
      "@reducer": path.resolve(__dirname, "src/reducer"),
      "@store": path.resolve(__dirname, "src/store"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@selectors": path.resolve(__dirname, "src/selectors"),
      "@components": path.resolve(__dirname, "src/components"),
      "@services": path.resolve(__dirname, "src/services"),
      "@validation": path.resolve(__dirname, "src/validation"),
      "@lib": path.resolve(__dirname, "src/lib"),
      "@schemas": path.resolve(__dirname, "src/schemas"),
      "@types": path.resolve(__dirname, "src/tes")
    }
  }
})
