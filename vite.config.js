import { defineConfig } from 'vite'
import dotenv from 'dotenv'
import react from '@vitejs/plugin-react'


dotenv.config() 

export default defineConfig({ 
  base:'/',
  plugins: [react()], 
  optimizeDeps: {
    exclude: ['js-big-decimal']
  },
  server: {
    headers: {
      'Cache-Control': 'no-store'
    },
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://ec2-3-82-206-23.compute-1.amazonaws.com:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api/v1')
      },
      '/ws': { 
          target: 'ws://ec2-3-82-206-23.compute-1.amazonaws.com:8000',
          ws: true,
          changeOrigin: true,
        }
    }
  }
})

 
 
