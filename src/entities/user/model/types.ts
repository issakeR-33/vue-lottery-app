// Модель користувача за схемою DummyJSON (https://dummyjson.com/docs/users).
// Описано лише поля, які використовує застосунок.

export type Gender = 'male' | 'female'

export interface Address {
  address: string
  city: string
  state: string
  postalCode: string
  country: string
}

export interface Company {
  name: string
  title: string
  department: string
}

export interface User {
  id: number
  firstName: string
  lastName: string
  maidenName?: string
  age: number
  gender: Gender
  email: string
  phone: string
  username: string
  password?: string
  birthDate?: string
  image?: string
  role?: string
  university?: string
  address?: Address
  company?: Company
}

export type CreateUserDto = Pick<
  User,
  'firstName' | 'lastName' | 'email' | 'username' | 'age' | 'gender' | 'phone'
> & { password: string }

export type UpdateUserDto = Partial<CreateUserDto>

export function fullName(user: Pick<User, 'firstName' | 'lastName'>): string {
  return `${user.firstName} ${user.lastName}`.trim()
}
