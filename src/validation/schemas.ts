import { z } from 'zod'

export const PASSWORD_MIN_LENGTH = 6

const REQUIRED = "Обов'язкове поле"
const PHONE_PATTERN = /^\+?[\d\s()-]{7,20}$/

const requiredText = (max = 50) =>
  z
    .string({ required_error: REQUIRED })
    .trim()
    .min(1, REQUIRED)
    .max(max, `Не більше ${max} символів`)

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

const password = z
  .string({ required_error: REQUIRED })
  .min(1, REQUIRED)
  .min(PASSWORD_MIN_LENGTH, `Щонайменше ${PASSWORD_MIN_LENGTH} символів`)

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

export const loginSchema = z.object({
  username: requiredText(30),
  password,
})

export type UserFormValues = z.infer<typeof createUserSchema>
export type LoginFormValues = z.infer<typeof loginSchema>
