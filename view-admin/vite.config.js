import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  //  server
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://ec2-3-82-206-23.compute-1.amazonaws.com:8000/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, 'api/v1')
      }
    }
  }
});

// http://ec2-3-82-206-23.compute-1.amazonaws.com:8000/