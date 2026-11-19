import { useToast } from 'primevue/usetoast'

const LIFE_MS = 4000

// Тонка обгортка над useToast: решта застосунку не знає, яка бібліотека показує сповіщення
export function useNotify() {
  const toast = useToast()

  return {
    success(summary: string, detail?: string): void {
      toast.add({ severity: 'success', summary, detail, life: LIFE_MS })
    },
    error(summary: string, detail?: string): void {
      toast.add({ severity: 'error', summary, detail, life: LIFE_MS })
    },
  }
}
