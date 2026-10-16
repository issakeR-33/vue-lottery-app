import type { Participant } from '../types/Participant'

export type SortKey = 'name' | 'dob'
export type SortDirection = 'asc' | 'desc'

export function filterByName(participants: readonly Participant[], query: string): Participant[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) {
    return [...participants]
  }
  return participants.filter((p) => p.name.toLowerCase().includes(normalized))
}

// Повертає новий масив, вихідний список не змінюється.
// Array.prototype.sort стабільний, тож рівні елементи зберігають порядок в обох напрямках.
export function sortParticipants(
  participants: readonly Participant[],
  key: SortKey | null,
  direction: SortDirection,
): Participant[] {
  const list = [...participants]
  if (!key) {
    return list
  }

  const factor = direction === 'asc' ? 1 : -1
  // дата у форматі yyyy-mm-dd, тому рядкове порівняння збігається з хронологічним
  return list.sort(
    (a, b) =>
      factor * (key === 'name' ? a.name.localeCompare(b.name, 'uk') : a.dob.localeCompare(b.dob)),
  )
}

export function nextParticipantId(participants: readonly Participant[]): number {
  return participants.reduce((max, p) => Math.max(max, p.id), 0) + 1
}
