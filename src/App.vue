<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Participant } from './types/Participant'
import type { ParticipantFormValues } from './utils/participantValidation'
import { nextParticipantId } from './utils/participants'
import WinnersList from './components/WinnersList.vue'
import RegistrationForm from './components/RegistrationForm.vue'
import ParticipantsTable from './components/ParticipantsTable.vue'

const MAX_WINNERS = 3

const participants = ref<Participant[]>([])

const winnerIds = ref<number[]>([])

const winners = computed(() =>
  winnerIds.value
    .map((id) => participants.value.find((p) => p.id === id))
    .filter((p): p is Participant => Boolean(p)),
)

const availableForWinning = computed(() =>
  participants.value.filter((p) => !winnerIds.value.includes(p.id)),
)

const canPickWinner = computed(
  () => winnerIds.value.length < MAX_WINNERS && availableForWinning.value.length > 0,
)

function pickWinner(): void {
  if (!canPickWinner.value) {
    return
  }

  const pool = availableForWinning.value
  const chosen = pool[Math.floor(Math.random() * pool.length)]
  if (chosen) {
    winnerIds.value.push(chosen.id)
  }
}

function removeWinner(id: number): void {
  winnerIds.value = winnerIds.value.filter((winnerId) => winnerId !== id)
}

function registerParticipant(values: ParticipantFormValues): void {
  participants.value.push({ id: nextParticipantId(participants.value), ...values })
}
</script>

<template>
  <main class="app">
    <WinnersList
      :winners="winners"
      :can-pick-winner="canPickWinner"
      @pick="pickWinner"
      @remove="removeWinner"
    />

    <RegistrationForm :participants="participants" @register="registerParticipant" />

    <ParticipantsTable :participants="participants" />
  </main>
</template>
