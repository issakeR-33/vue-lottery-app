<script setup lang="ts">
import { computed } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import type { Gender } from '@/entities/user'
import { AppButton, AppInput, AppMessage, AppSelect } from '@/shared/ui'
import { createUserSchema, editUserSchema, type UserFormValues } from '../model/schemas'

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

const genderOptions: { label: string; value: Gender }[] = [
  { label: 'Female', value: 'female' },
  { label: 'Male', value: 'male' },
]

// як у лабораторній 4: після першої спроби збереження поля підсвічуються зеленим або червоним
const validated = computed(() => submitCount.value > 0)

const onSubmit = handleSubmit((values) => emit('submit', values))

// очищення форми скидає й помилки, тому валідація після нього не спрацьовує
defineExpose({ reset: () => resetForm({ values: { password: '' } }) })
</script>

<template>
  <form class="user-form" novalidate @submit="onSubmit">
    <AppMessage v-if="serverError">{{ serverError }}</AppMessage>
    <div class="user-form__grid">
      <AppInput
        v-model="firstName"
        v-bind="firstNameAttrs"
        label="First name"
        placeholder="Enter first name"
        autocomplete="given-name"
        :error="errors.firstName"
        :valid="validated"
      />
      <AppInput
        v-model="lastName"
        v-bind="lastNameAttrs"
        label="Last name"
        placeholder="Enter last name"
        autocomplete="family-name"
        :error="errors.lastName"
        :valid="validated"
      />
      <AppInput
        v-model="email"
        v-bind="emailAttrs"
        type="email"
        label="Email"
        placeholder="Enter email"
        autocomplete="email"
        :error="errors.email"
        :valid="validated"
      />
      <AppInput
        v-model="username"
        v-bind="usernameAttrs"
        label="Username"
        placeholder="Enter username"
        autocomplete="username"
        :error="errors.username"
        :valid="validated"
      />
      <AppInput
        v-model="password"
        v-bind="passwordAttrs"
        type="password"
        label="Password"
        :placeholder="mode === 'edit' ? 'Залиште порожнім, щоб не змінювати' : 'Enter password'"
        autocomplete="new-password"
        :error="errors.password"
        :valid="validated && Boolean(password)"
      />
      <AppInput
        v-model="phone"
        v-bind="phoneAttrs"
        type="tel"
        label="Phone number"
        placeholder="Enter Phone number"
        autocomplete="tel"
        :error="errors.phone"
        :valid="validated"
      />
      <AppInput
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
      <AppSelect
        v-model="gender"
        v-bind="genderAttrs"
        label="Gender"
        placeholder="Оберіть стать"
        :options="genderOptions"
        :error="errors.gender"
        :valid="validated"
      />
    </div>
    <div class="user-form__actions">
      <slot name="actions" />
      <AppButton type="submit" :label="submitLabel" :loading="submitting" />
    </div>
  </form>
</template>

<style scoped lang="scss">
.user-form {
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    column-gap: 20px;
  }

  &__actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 16px;
  }
}
</style>
