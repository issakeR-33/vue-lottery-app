export interface ParticipantFormValues {
  name: string
  dob: string
  email: string
  phone: string
}

export type ParticipantFormErrors = Record<keyof ParticipantFormValues, string>

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^\+380\d{9}$/
const REQUIRED = "Поле обов'язкове для заповнення"

export function emptyFormValues(): ParticipantFormValues {
  return { name: '', dob: '', email: '', phone: '' }
}

export function emptyFormErrors(): ParticipantFormErrors {
  return { name: '', dob: '', email: '', phone: '' }
}

// Локальна дата у форматі yyyy-mm-dd. new Date('yyyy-mm-dd') парситься як UTC,
// тому порівнювати рядки надійніше, ніж об'єкти Date.
export function todayIsoDate(now: Date = new Date()): string {
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function validateParticipantForm(
  values: ParticipantFormValues,
  existingEmails: string[],
  today: string = todayIsoDate(),
): ParticipantFormErrors {
  const errors = emptyFormErrors()
  const email = values.email.trim()
  const phone = values.phone.trim()

  if (!values.name.trim()) {
    errors.name = REQUIRED
  }

  if (!email) {
    errors.email = REQUIRED
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Некоректний формат email'
  } else if (existingEmails.includes(email.toLowerCase())) {
    errors.email = 'Учасник з такою поштою вже зареєстрований'
  }

  if (!phone) {
    errors.phone = REQUIRED
  } else if (!PHONE_REGEX.test(phone)) {
    errors.phone = 'Формат телефону: +380XXXXXXXXX'
  }

  if (!values.dob) {
    errors.dob = REQUIRED
  } else if (values.dob > today) {
    errors.dob = 'Дата народження не може бути у майбутньому'
  }

  return errors
}

export function hasErrors(errors: ParticipantFormErrors): boolean {
  return Object.values(errors).some(Boolean)
}

export function normalizeFormValues(values: ParticipantFormValues): ParticipantFormValues {
  return {
    name: values.name.trim(),
    dob: values.dob,
    email: values.email.trim(),
    phone: values.phone.trim(),
  }
}
