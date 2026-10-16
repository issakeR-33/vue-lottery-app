import type { Participant } from '../types/Participant'

export function nextParticipantId(participants: readonly Participant[]): number {
  return participants.reduce((max, p) => Math.max(max, p.id), 0) + 1
}
