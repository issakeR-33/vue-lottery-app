<script setup lang="ts">
import { ref } from 'vue'
import type { Participant } from './types/Participant'
import type { ParticipantFormValues } from './utils/participantValidation'
import { nextParticipantId } from './utils/participants'
import RegistrationForm from './components/RegistrationForm.vue'
import ParticipantsTable from './components/ParticipantsTable.vue'

const participants = ref<Participant[]>([])

function registerParticipant(values: ParticipantFormValues): void {
  participants.value.push({ id: nextParticipantId(participants.value), ...values })
}
</script>

<template>
  <main class="app">
    <RegistrationForm :participants="participants" @register="registerParticipant" />

    <ParticipantsTable :participants="participants" />
  </main>
</template>
