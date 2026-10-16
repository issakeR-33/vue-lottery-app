import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config.ts'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      // тести не ходять у мережу: fetch підміняється, а адреса API фіктивна
      env: { VITE_API_URL: 'https://api.test', VITE_TOKEN_TTL_MINUTES: '30' },
    },
  }),
)
