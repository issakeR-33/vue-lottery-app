import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  // відносні шляхи, щоб збірку можна було розгорнути на GitHub Pages у підпапці
  base: './',
  plugins: [vue(), vueDevTools()],
  build: {
    rollupOptions: {
      output: {
        // GitHub Pages (Jekyll) не віддає файли, що починаються з "_",
        // а Vite так називає спільний чанк _plugin-vue_export-helper
        chunkFileNames: (chunk) => `assets/${chunk.name.replace(/^_+/, '')}-[hash].js`,
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
