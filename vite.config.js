import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Base path для GitHub Pages (название репозитория)
  base: '/',
  
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  
  server: {
    port: 3000,
    open: true,
    host: true, // Разрешить внешние подключения
  },
  
  build: {
    outDir: 'dist',
    sourcemap: true,
    assetsDir: 'assets',
    
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          framer: ['framer-motion'],
          icons: ['lucide-react'],
          utils: ['clsx', 'tailwind-merge'],
        },
        // Оптимизация для кэширования
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
    
    // Оптимизация размера bundle
    minify: 'esbuild',
    target: 'esnext',
    
    // Улучшенная обработка CSS
    cssCodeSplit: true,
  },
  
  preview: {
    port: 4173,
    host: true,
  },
  
  // Оптимизация для производства
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
}) 