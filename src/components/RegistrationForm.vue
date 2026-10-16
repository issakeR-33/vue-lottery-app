<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
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
// після першої спроби збереження поля підсвічуються зеленим або червоним і перевіряються на льоту
const validated = ref(false)

function validate(): boolean {
  const existingEmails = props.participants.map((p) => p.email.toLowerCase())
  const validationErrors = validateParticipantForm(form, existingEmails)
  Object.assign(errors, validationErrors)
  return !hasErrors(validationErrors)
}

watch(form, () => {
  if (validated.value) {
    validate()
  }
})

// скидаємо і значення, і помилки, тому валідація після очищення не спрацьовує
function resetForm(): void {
  validated.value = false
  Object.assign(form, emptyFormValues())
  Object.assign(errors, emptyFormErrors())
}

function handleSave(): void {
  validated.value = true
  if (!validate()) {
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
          :valid="validated && !errors.name"
          :error="errors.name"
        />
        <BaseInput
          v-model="form.dob"
          type="date"
          label="Date of Birth"
          :max="todayIsoDate()"
          :valid="validated && !errors.dob"
          :error="errors.dob"
        />
        <BaseInput
          v-model="form.email"
          type="email"
          label="Email"
          placeholder="Enter email"
          :valid="validated && !errors.email"
          :error="errors.email"
        />
        <BaseInput
          v-model="form.phone"
          type="tel"
          label="Phone number"
          placeholder="Enter Phone number"
          :valid="validated && !errors.phone"
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
.card-title {
  margin-bottom: 2px;
  font-size: 1rem;
  font-weight: 700;
}

.hint {
  margin-bottom: 18px;
  color: #98a6ad;
  font-size: 1rem;
}

.form-actions {
  margin-top: 30px;
  text-align: right;
}
</style>
