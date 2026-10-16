<script setup lang="ts">
import { computed, useId } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { createUserSchema, editUserSchema, type UserFormValues } from '@/validation/schemas'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'

const props = defineProps<{
  mode: 'create' | 'edit'
  initialValues?: Partial<UserFormValues>
  submitLabel: string
  submitting?: boolean
  serverError?: string | null
}>()

const emit = defineEmits<{
  submit: [values: UserFormValues]
}>()

const { defineField, handleSubmit, errors, resetForm, submitCount } = useForm({
  validationSchema: toTypedSchema(props.mode === 'create' ? createUserSchema : editUserSchema),
  initialValues: { password: '', ...props.initialValues },
})

const [firstName, firstNameAttrs] = defineField('firstName')
const [lastName, lastNameAttrs] = defineField('lastName')
const [email, emailAttrs] = defineField('email')
const [username, usernameAttrs] = defineField('username')
const [password, passwordAttrs] = defineField('password')
const [ageValue, ageAttrs] = defineField('age')
// схема віку приймає будь-яке значення (preprocess), тому для поля вводу звужуємо тип
const age = computed({
  get: () => ageValue.value as number | undefined,
  set: (value) => {
    ageValue.value = value
  },
})
const [gender, genderAttrs] = defineField('gender')
const [phone, phoneAttrs] = defineField('phone')

// як у лабораторній 4: після першої спроби збереження поля підсвічуються зеленим або червоним
const validated = computed(() => submitCount.value > 0)
const genderId = useId()

const onSubmit = handleSubmit((values) => emit('submit', values))

// очищення форми скидає й помилки, тому валідація після нього не спрацьовує
defineExpose({ reset: () => resetForm({ values: { password: '' } }) })
</script>

<template>
  <form class="user-form" novalidate @submit="onSubmit">
    <div v-if="serverError" class="alert alert-danger" role="alert">{{ serverError }}</div>

    <div class="user-form__grid">
      <BaseInput
        v-model="firstName"
        v-bind="firstNameAttrs"
        label="First name"
        placeholder="Enter first name"
        autocomplete="given-name"
        :error="errors.firstName"
        :valid="validated"
      />
      <BaseInput
        v-model="lastName"
        v-bind="lastNameAttrs"
        label="Last name"
        placeholder="Enter last name"
        autocomplete="family-name"
        :error="errors.lastName"
        :valid="validated"
      />
      <BaseInput
        v-model="email"
        v-bind="emailAttrs"
        type="email"
        label="Email"
        placeholder="Enter email"
        autocomplete="email"
        :error="errors.email"
        :valid="validated"
      />
      <BaseInput
        v-model="username"
        v-bind="usernameAttrs"
        label="Username"
        placeholder="Enter username"
        autocomplete="username"
        :error="errors.username"
        :valid="validated"
      />
      <BaseInput
        v-model="password"
        v-bind="passwordAttrs"
        type="password"
        label="Password"
        :placeholder="mode === 'edit' ? 'Залиште порожнім, щоб не змінювати' : 'Enter password'"
        autocomplete="new-password"
        :error="errors.password"
        :valid="validated && Boolean(password)"
      />
      <BaseInput
        v-model="phone"
        v-bind="phoneAttrs"
        type="tel"
        label="Phone number"
        placeholder="Enter Phone number"
        autocomplete="tel"
        :error="errors.phone"
        :valid="validated"
      />
      <BaseInput
        v-model="age"
        v-bind="ageAttrs"
        type="number"
        label="Age"
        placeholder="Enter age"
        min="1"
        max="120"
        :error="errors.age"
        :valid="validated"
      />
      <div class="field">
        <label class="form-label" :for="genderId">Gender</label>
        <select
          :id="genderId"
          v-model="gender"
          v-bind="genderAttrs"
          class="form-select"
          :class="{ 'is-invalid': errors.gender, 'is-valid': validated && !errors.gender }"
        >
          <option :value="undefined" disabled>Оберіть стать</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>
        <div v-if="errors.gender" class="invalid-feedback">{{ errors.gender }}</div>
      </div>
    </div>

    <div class="user-form__actions">
      <slot name="actions" />
      <BaseButton type="submit" :disabled="submitting">
        <span v-if="submitting" class="spinner-border spinner-border-sm" aria-hidden="true"></span>
        {{ submitLabel }}
      </BaseButton>
    </div>
  </form>
</template>

<style scoped>
.user-form__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  column-gap: 20px;
}

.field {
  margin-bottom: 14px;
}

.field label {
  font-weight: 600;
  margin-bottom: 4px;
}

.invalid-feedback {
  font-size: 0.75rem;
}

.user-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}
</style>
