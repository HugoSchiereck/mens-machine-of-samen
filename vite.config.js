import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// In dev draait de API-server op poort 4747 (of PORT); Vite stuurt /api daarheen door.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: { '/api': { target: `http://localhost:${process.env.PORT || 4747}`, changeOrigin: true } },
  },
})
