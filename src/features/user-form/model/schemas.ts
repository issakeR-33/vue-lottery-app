import { z } from 'zod'
import { password, PASSWORD_MIN_LENGTH, REQUIRED, requiredText } from '@/shared/lib'

const PHONE_PATTERN = /^\+?[\d\s()-]{7,20}$/

// '' з поля type="number" перетворюємо на undefined, щоб показати "обов'язкове поле", а не "0"
const age = z.preprocess(
  (value) => (value === '' || value === null || value === undefined ? undefined : Number(value)),
  z
    .number({ required_error: REQUIRED, invalid_type_error: 'Вкажіть число' })
    .int('Ціле число')
    .min(1, 'Від 1 року')
    .max(120, 'До 120 років'),
)

const userFields = {
  firstName: requiredText(),
  lastName: requiredText(),
  email: requiredText(100).email('Некоректний формат email'),
  username: requiredText(30)
    .min(3, 'Щонайменше 3 символи')
    .regex(/^[a-z0-9._-]+$/i, 'Лише латиниця, цифри та . _ -'),
  age,
  gender: z.enum(['male', 'female'], {
    errorMap: () => ({ message: 'Оберіть стать' }),
  }),
  phone: requiredText(20).regex(PHONE_PATTERN, 'Формат: +380 50 123 4567'),
}

export const createUserSchema = z.object({ ...userFields, password })

// при редагуванні порожній пароль означає "не змінювати"
export const editUserSchema = z.object({
  ...userFields,
  password: z
    .string()
    .refine(
      (value) => value === '' || value.length >= PASSWORD_MIN_LENGTH,
      `Щонайменше ${PASSWORD_MIN_LENGTH} символів`,
    ),
})

export type UserFormValues = z.infer<typeof createUserSchema>
