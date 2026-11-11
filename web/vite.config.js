import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The proxy sends /api calls from the frontend (5173) to the Express server (5000).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:5000' },
  },
})
