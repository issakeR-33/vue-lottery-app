import { describe, expect, it } from 'vitest'
import {
  hasErrors,
  todayIsoDate,
  validateParticipantForm,
  type ParticipantFormValues,
} from '../participantValidation'

const TODAY = '2026-10-16'

const valid: ParticipantFormValues = {
  name: 'Олена',
  dob: '2000-05-12',
  email: 'olena@example.com',
  phone: '+380501234567',
}

function validate(overrides: Partial<ParticipantFormValues>, emails: string[] = []) {
  return validateParticipantForm({ ...valid, ...overrides }, emails, TODAY)
}

describe('validateParticipantForm', () => {
  it('accepts valid values', () => {
    expect(hasErrors(validate({}))).toBe(false)
  })

  it('requires every field', () => {
    const errors = validate({ name: ' ', dob: '', email: '', phone: '' })
    expect(Object.values(errors).every(Boolean)).toBe(true)
  })

  it('rejects a malformed e-mail', () => {
    expect(validate({ email: 'olena@example' }).email).toBe('Некоректний формат email')
  })

  it.each(['0501234567', '+38050123456', '+3805012345678', '+381501234567'])(
    'rejects phone %s',
    (phone) => {
      expect(validate({ phone }).phone).not.toBe('')
    },
  )

  it('rejects a date of birth in the future but accepts today', () => {
    expect(validate({ dob: '2026-10-17' }).dob).not.toBe('')
    expect(validate({ dob: TODAY }).dob).toBe('')
  })

  it('checks e-mail uniqueness ignoring case', () => {
    const errors = validate({ email: 'OLENA@Example.com' }, ['olena@example.com'])
    expect(errors.email).toBe('Учасник з такою поштою вже зареєстрований')
  })
})

describe('todayIsoDate', () => {
  it('formats the local date as yyyy-mm-dd', () => {
    expect(todayIsoDate(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05')
  })
})
