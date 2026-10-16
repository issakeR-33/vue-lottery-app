<script setup lang="ts">
import type { Participant } from '../types/Participant'
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'

const props = defineProps<{
  participant: Participant | null
}>()

const emit = defineEmits<{
  confirm: [id: number]
}>()

const open = defineModel<boolean>('open', { required: true })

function confirm(): void {
  if (props.participant) {
    emit('confirm', props.participant.id)
  }
  open.value = false
}
</script>

<template>
  <BaseModal v-model="open">
    <template #header>
      <h5 class="modal-title">Видалення учасника</h5>
    </template>

    <p v-if="participant" class="delete-text">
      Ви дійсно бажаєте видалити учасника "{{ participant.name }}", "{{ participant.email }}"?
    </p>

    <template #footer>
      <BaseButton variant="secondary" @click="open = false">Ні</BaseButton>
      <BaseButton @click="confirm">Так</BaseButton>
    </template>
  </BaseModal>
</template>

<style scoped>
.delete-text {
  margin: 0;
}
</style>
