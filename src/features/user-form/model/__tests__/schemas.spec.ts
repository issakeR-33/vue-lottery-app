import { describe, expect, it } from 'vitest'
import { createUserSchema, editUserSchema, loginSchema } from '../schemas'

const valid = {
  firstName: 'Ann',
  lastName: 'Lee',
  email: 'ann@example.com',
  username: 'ann.lee',
  password: 'secret1',
  age: '30',
  gender: 'female',
  phone: '+380 50 123 4567',
}

function messages(result: {
  success: boolean
  error?: { issues: { path: PropertyKey[]; message: string }[] }
}) {
  return Object.fromEntries((result.error?.issues ?? []).map((i) => [i.path.join('.'), i.message]))
}

describe('user schemas', () => {
  it('accepts valid values and turns the age into a number', () => {
    const result = createUserSchema.safeParse(valid)
    expect(result.success).toBe(true)
    expect(result.data?.age).toBe(30)
  })

  it('requires every field', () => {
    const errors = messages(createUserSchema.safeParse({ age: '' }))
    expect(Object.keys(errors).sort()).toEqual(
      ['age', 'email', 'firstName', 'gender', 'lastName', 'password', 'phone', 'username'].sort(),
    )
    expect(errors.age).toBe("Обов'язкове поле")
  })

  it('checks the e-mail format and the password length', () => {
    const errors = messages(
      createUserSchema.safeParse({ ...valid, email: 'ann@', password: '12345' }),
    )
    expect(errors.email).toBe('Некоректний формат email')
    expect(errors.password).toBe('Щонайменше 6 символів')
  })

  it('lets the password stay empty only when editing', () => {
    expect(editUserSchema.safeParse({ ...valid, password: '' }).success).toBe(true)
    expect(createUserSchema.safeParse({ ...valid, password: '' }).success).toBe(false)
    expect(editUserSchema.safeParse({ ...valid, password: '123' }).success).toBe(false)
  })

  it('validates the login form', () => {
    expect(loginSchema.safeParse({ username: 'emilys', password: 'emilyspass' }).success).toBe(true)
    const result = loginSchema.safeParse({ username: ' ', password: '' })
    expect(messages(result).username).toBe("Обов'язкове поле")
    // VeeValidate показує першу помилку поля
    expect(result.error?.issues.find((i) => i.path[0] === 'password')?.message).toBe(
      "Обов'язкове поле",
    )
  })
})
