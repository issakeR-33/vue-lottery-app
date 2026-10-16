<script setup lang="ts">
import { reactive } from 'vue'
import type { Participant } from '../types/Participant'
import {
  emptyFormErrors,
  emptyFormValues,
  hasErrors,
  normalizeFormValues,
  todayIsoDate,
  validateParticipantForm,
  type ParticipantFormValues,
} from '../utils/participantValidation'
import BaseInput from './BaseInput.vue'
import BaseButton from './BaseButton.vue'

const props = defineProps<{
  participants: Participant[]
}>()

const emit = defineEmits<{
  register: [values: ParticipantFormValues]
}>()

const form = reactive(emptyFormValues())
const errors = reactive(emptyFormErrors())

// скидаємо і значення, і помилки, тому валідація після очищення не спрацьовує
function resetForm(): void {
  Object.assign(form, emptyFormValues())
  Object.assign(errors, emptyFormErrors())
}

function handleSave(): void {
  const existingEmails = props.participants.map((p) => p.email.toLowerCase())
  const validationErrors = validateParticipantForm(form, existingEmails)
  Object.assign(errors, validationErrors)

  if (hasErrors(validationErrors)) {
    return
  }

  emit('register', normalizeFormValues(form))
  resetForm()
}
</script>

<template>
  <div class="card form-card">
    <div class="card-body">
      <h5 class="card-title">REGISTER FORM</h5>
      <p class="hint">Please fill in all the fields.</p>

      <!-- .enter лише на полях: Enter на кнопці Save вже дає click, інакше збереження спрацювало б двічі -->
      <div @keyup.enter="handleSave">
        <BaseInput
          v-model="form.name"
          label="Name"
          placeholder="Enter user name"
          :error="errors.name"
        />
        <BaseInput
          v-model="form.dob"
          type="date"
          label="Date of Birth"
          :max="todayIsoDate()"
          :error="errors.dob"
        />
        <BaseInput
          v-model="form.email"
          type="email"
          label="Email"
          placeholder="Enter email"
          :error="errors.email"
        />
        <BaseInput
          v-model="form.phone"
          type="tel"
          label="Phone number"
          placeholder="Enter Phone number"
          :error="errors.phone"
        />
      </div>

      <div class="form-actions">
        <BaseButton @click="handleSave">Save</BaseButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-card {
  margin-bottom: 32px;
}

.card-title {
  font-size: 1.5rem;
}

.hint {
  color: #6c757d;
  font-size: 0.95rem;
  margin-bottom: 24px;
}

.form-actions {
  text-align: right;
}
</style>
