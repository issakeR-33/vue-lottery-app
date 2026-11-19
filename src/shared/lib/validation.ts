import { z } from 'zod'

// Спільні правила полів форм. Схеми конкретних форм живуть у своїх features
// (user-form, auth) і будуються з цих цеглинок.
export const PASSWORD_MIN_LENGTH = 6

export const REQUIRED = "Обов'язкове поле"

export const requiredText = (max = 50) =>
  z
    .string({ required_error: REQUIRED })
    .trim()
    .min(1, REQUIRED)
    .max(max, `Не більше ${max} символів`)

export const password = z
  .string({ required_error: REQUIRED })
  .min(1, REQUIRED)
  .min(PASSWORD_MIN_LENGTH, `Щонайменше ${PASSWORD_MIN_LENGTH} символів`)
