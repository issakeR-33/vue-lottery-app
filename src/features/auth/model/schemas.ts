import { z } from 'zod'
import { password, requiredText } from '@/shared/lib'

export const loginSchema = z.object({
  username: requiredText(30),
  password,
})

export type LoginFormValues = z.infer<typeof loginSchema>
