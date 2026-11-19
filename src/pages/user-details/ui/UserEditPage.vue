<script setup lang="ts">
import { computed, ref } from 'vue'
import { AppButton } from '@/shared/ui'
import { useUsersStore, type UpdateUserDto, type User } from '@/entities/user'
import { UserForm, type UserFormValues } from '@/features/user-form'

// користувача передає батьківська сторінка /users/:id через <RouterView :user="user">
const props = defineProps<{
  user: User
}>()

const emit = defineEmits<{
  saved: [user: User]
}>()

const store = useUsersStore()
const isSaving = ref(false)
const serverError = ref<string | null>(null)

const initialValues = computed(() => {
  const { firstName, lastName, email, username, age, gender, phone } = props.user
  return { firstName, lastName, email, username, age, gender, phone, password: '' }
})

async function save({ password, ...values }: UserFormValues): Promise<void> {
  isSaving.value = true
  serverError.value = null
  const data: UpdateUserDto = password ? { ...values, password } : values
  try {
    emit('saved', await store.updateUser(props.user.id, data))
  } catch (e) {
    serverError.value = (e as Error).message
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <section class="edit-section">
    <h2 class="edit-section__title">Редагування учасника</h2>
    <UserForm
      :key="user.id"
      mode="edit"
      :initial-values="initialValues"
      submit-label="Оновити дані"
      :submitting="isSaving"
      :server-error="serverError"
      @submit="save"
    >
      <template #actions>
        <AppButton
          label="Скасувати"
          severity="secondary"
          variant="outlined"
          :to="{ name: 'user', params: { id: user.id } }"
        />
      </template>
    </UserForm>
  </section>
</template>

<style scoped lang="scss">
.edit-section {
  padding-top: 16px;
  border-top: 1px solid var(--p-content-border-color);

  &__title {
    margin-bottom: 16px;
    font-size: 1rem;
    font-weight: 700;
    text-transform: uppercase;
  }
}
</style>
