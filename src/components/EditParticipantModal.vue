<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { Participant } from '../types/Participant'
import {
  emptyFormErrors,
  emptyFormValues,
  hasErrors,
  normalizeFormValues,
  todayIsoDate,
  validateParticipantForm,
} from '../utils/participantValidation'
import BaseModal from './BaseModal.vue'
import BaseInput from './BaseInput.vue'
import BaseButton from './BaseButton.vue'

const props = defineProps<{
  participant: Participant | null
  participants: Participant[]
}>()

const emit = defineEmits<{
  update: [participant: Participant]
}>()

const open = defineModel<boolean>('open', { required: true })

const form = reactive(emptyFormValues())
const errors = reactive(emptyFormErrors())

// заповнюємо форму даними учасника щоразу, коли модалка відкривається
watch(open, (isOpen) => {
  if (!isOpen || !props.participant) {
    return
  }
  const { name, dob, email, phone } = props.participant
  Object.assign(form, { name, dob, email, phone })
  Object.assign(errors, emptyFormErrors())
})

function submit(): void {
  const editing = props.participant
  if (!editing) {
    return
  }

  // власний e-mail учасника дублікатом не вважається
  const existingEmails = props.participants
    .filter((p) => p.id !== editing.id)
    .map((p) => p.email.toLowerCase())

  const validationErrors = validateParticipantForm(form, existingEmails)
  Object.assign(errors, validationErrors)

  if (hasErrors(validationErrors)) {
    return
  }

  emit('update', { id: editing.id, ...normalizeFormValues(form) })
  open.value = false
}
</script>

<template>
  <BaseModal v-model="open">
    <template #header>
      <h5 class="modal-title">Редагування учасника</h5>
    </template>

    <div @keyup.enter="submit">
      <BaseInput v-model="form.name" label="Name" :error="errors.name" />
      <BaseInput
        v-model="form.dob"
        type="date"
        label="Date of Birth"
        :max="todayIsoDate()"
        :error="errors.dob"
      />
      <BaseInput v-model="form.email" type="email" label="Email" :error="errors.email" />
      <BaseInput v-model="form.phone" type="tel" label="Phone number" :error="errors.phone" />
    </div>

    <template #footer>
      <BaseButton @click="submit">Оновити дані</BaseButton>
    </template>
  </BaseModal>
</template>
