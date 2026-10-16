/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_TOKEN_TTL_MINUTES?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
