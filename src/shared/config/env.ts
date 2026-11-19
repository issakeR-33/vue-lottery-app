// Налаштування середовища читаються лише тут, решта коду не знає про import.meta.env
export const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

export const TOKEN_TTL_MINUTES = Number(import.meta.env.VITE_TOKEN_TTL_MINUTES) || 30
