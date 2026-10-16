<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { HttpError } from '@/api/http-client'
import { useAuthStore } from '@/stores/auth'
import { safeRedirect } from '@/router/guards'
import { loginSchema, type LoginFormValues } from '@/validation/schemas'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

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
    await auth.login(values)
    // після входу повертаємося на сторінку, з якої guard перенаправив на логін
    await router.replace(safeRedirect(route.query.redirect) ?? { name: 'users' })
  } catch (error) {
    authError.value = describeError(error)
  } finally {
    isSubmitting.value = false
  }
})
</script>

<template>
  <div class="card">
    <div class="card-body">
      <h1 class="login-title">LOGIN</h1>
      <p class="hint">Увійдіть, щоб побачити список учасників.</p>

      <form novalidate @submit="onSubmit">
        <div v-if="authError" class="alert alert-danger" role="alert">{{ authError }}</div>

        <BaseInput
          v-model="username"
          v-bind="usernameAttrs"
          label="Username"
          placeholder="Enter username"
          autocomplete="username"
          :error="errors.username"
          :valid="submitCount > 0"
        />
        <BaseInput
          v-model="password"
          v-bind="passwordAttrs"
          type="password"
          label="Password"
          placeholder="Enter password"
          autocomplete="current-password"
          :error="errors.password"
          :valid="submitCount > 0"
        />

        <BaseButton type="submit" class="login-submit" :disabled="isSubmitting">
          <span
            v-if="isSubmitting"
            class="spinner-border spinner-border-sm"
            aria-hidden="true"
          ></span>
          Login
        </BaseButton>
      </form>

      <p class="demo-account">
        Тестовий акаунт DummyJSON: <code>emilys</code> / <code>emilyspass</code>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-title {
  margin-bottom: 2px;
  font-size: 1rem;
  font-weight: 700;
}

.hint {
  margin-bottom: 18px;
  color: #98a6ad;
}

.login-submit {
  width: 100%;
  margin-top: 8px;
}

.demo-account {
  margin: 16px 0 0;
  color: #98a6ad;
  font-size: 0.85rem;
  text-align: center;
}
</style>
