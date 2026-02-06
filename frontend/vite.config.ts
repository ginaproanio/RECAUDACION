import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Configuración de proxy para desarrollo
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  // Configuración para preview (producción)
  preview: {
    host: true,  // Escuchar en todas las interfaces
    port: process.env.PORT ? parseInt(process.env.PORT) : 8080,
  },
  // Configuración de build para SPA
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
})
