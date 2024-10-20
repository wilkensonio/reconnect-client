import { defineConfig } from 'vite'
import dotenv from 'dotenv'
import react from '@vitejs/plugin-react'


dotenv.config() 

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()], 
  optimizeDeps: {
    exclude: ['js-big-decimal']
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://ec2-3-82-206-23.compute-1.amazonaws.com:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1')
      }
    }
  }
})

 
