<script setup lang="ts">
import { ref } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { HttpError } from '@/shared/api'
import { AppButton, AppInput, AppMessage, useNotify } from '@/shared/ui'
import { useSessionStore } from '@/entities/session'
import { loginSchema, type LoginFormValues } from '../model/schemas'

const emit = defineEmits<{
  success: []
}>()

const session = useSessionStore()
const notify = useNotify()

const { defineField, handleSubmit, errors, submitCount } = useForm({
  validationSchema: toTypedSchema(loginSchema),
})

const [username, usernameAttrs] = defineField('username')
const [password, passwordAttrs] = defineField('password')

const isSubmitting = ref(false)
const authError = ref<string | null>(null)

function describeError(error: unknown): string {
  if (error instanceof HttpError && (error.status === 400 || error.status === 401)) {
    return 'Невірний логін або пароль'
  }
  return `Не вдалося увійти: ${(error as Error).message}`
}

const onSubmit = handleSubmit(async (values: LoginFormValues) => {
  isSubmitting.value = true
  authError.value = null
  try {
    await session.login(values)
    emit('success')
  } catch (error) {
    authError.value = describeError(error)
    notify.error('Помилка авторизації', authError.value)
  } finally {
    isSubmitting.value = false
  }
})
</script>

<template>
  <form novalidate @submit="onSubmit">
    <AppMessage v-if="authError">{{ authError }}</AppMessage>
    <AppInput
      v-model="username"
      v-bind="usernameAttrs"
      label="Username"
      placeholder="Enter username"
      autocomplete="username"
      :error="errors.username"
      :valid="submitCount > 0"
    />
    <AppInput
      v-model="password"
      v-bind="passwordAttrs"
      type="password"
      label="Password"
      placeholder="Enter password"
      autocomplete="current-password"
      :error="errors.password"
      :valid="submitCount > 0"
    />
    <AppButton type="submit" label="Login" class="login-submit" :loading="isSubmitting" />
  </form>
</template>

<style scoped lang="scss">
.login-submit {
  width: 100%;
  margin-top: 8px;
}
</style>
