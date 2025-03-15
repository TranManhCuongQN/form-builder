import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['recharts', 'date-fns'],
    esbuildOptions: {
      // Sửa lỗi "process is not defined" với recharts
      define: {
        global: 'globalThis',
      },
    },
  },
  resolve: {
    alias: {
      // Sửa lỗi liên quan đến các thư viện sử dụng process.env
      'process': 'process/browser',
    },
  },
})
