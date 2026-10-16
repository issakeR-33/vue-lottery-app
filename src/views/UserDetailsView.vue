<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUsersStore } from '@/stores/users'
import { fullName, type User } from '@/types/user'
import BaseButton from '@/components/BaseButton.vue'
import ConfirmDeleteModal from '@/components/users/ConfirmDeleteModal.vue'

// id приходить з маршруту /users/:id через props: true
const props = defineProps<{
  id: string
}>()

const store = useUsersStore()
const route = useRoute()
const router = useRouter()

const user = ref<User | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

async function loadUser(): Promise<void> {
  isLoading.value = true
  error.value = null
  try {
    user.value = await store.getUser(Number(props.id))
  } catch (e) {
    user.value = null
    error.value = (e as Error).message
  } finally {
    isLoading.value = false
  }
}

// той самий компонент перевикористовується при переході між /users/1 і /users/2
watch(() => props.id, loadUser, { immediate: true })

const isEditing = computed(() => route.name === 'user-edit')
const backToList = computed(() => ({ name: 'users', query: store.listQuery }))

const details = computed(() => {
  const u = user.value
  if (!u) return []
  return [
    { label: 'Username', value: u.username },
    { label: 'Email', value: u.email },
    { label: 'Phone', value: u.phone },
    { label: 'Age', value: String(u.age) },
    { label: 'Gender', value: u.gender === 'female' ? 'Female' : 'Male' },
    { label: 'Birth date', value: u.birthDate },
    { label: 'University', value: u.university },
    { label: 'Company', value: u.company?.name && `${u.company.title}, ${u.company.name}` },
    {
      label: 'Address',
      value: u.address?.city && `${u.address.address}, ${u.address.city}, ${u.address.country}`,
    },
  ].filter((item) => Boolean(item.value))
})

function onSaved(updated: User): void {
  user.value = updated
  store.notify('Дані учасника оновлено')
  router.push({ name: 'user', params: { id: updated.id } })
}

const isDeleteOpen = ref(false)
const isDeleting = ref(false)
const deleteError = ref<string | null>(null)

async function deleteUser(target: User): Promise<void> {
  isDeleting.value = true
  deleteError.value = null
  try {
    await store.deleteUser(target.id)
    store.notify(`Учасника ${fullName(target)} видалено`)
    await router.push(backToList.value)
  } catch (e) {
    deleteError.value = (e as Error).message
  } finally {
    isDeleting.value = false
    isDeleteOpen.value = false
  }
}
</script>

<template>
  <div class="user-page">
    <RouterLink :to="backToList" class="back-link">
      <i class="bi bi-arrow-left"></i> До списку учасників
    </RouterLink>

    <div v-if="store.notice" class="alert alert-success" role="status">{{ store.notice }}</div>

    <div class="card">
      <div v-if="isLoading" class="card-body state" role="status">
        <span class="spinner-border spinner-border-sm state__spinner"></span>
        Завантаження...
      </div>

      <div v-else-if="error" class="card-body">
        <div class="alert alert-danger" role="alert">
          Не вдалося завантажити учасника: {{ error }}
        </div>
        <RouterLink :to="backToList" class="btn btn-primary">До списку</RouterLink>
      </div>

      <div v-else-if="user" class="card-body">
        <div class="profile">
          <img v-if="user.image" :src="user.image" :alt="fullName(user)" class="profile__avatar" />
          <span v-else class="profile__avatar profile__avatar--initials">
            {{ user.firstName[0] }}{{ user.lastName[0] }}
          </span>
          <div class="profile__main">
            <h1 class="profile__name">{{ fullName(user) }}</h1>
            <p class="profile__meta">@{{ user.username }} · #{{ user.id }}</p>
          </div>
          <div v-if="!isEditing" class="profile__actions">
            <RouterLink
              :to="{ name: 'user-edit', params: { id: user.id } }"
              class="btn btn-primary"
            >
              <i class="bi bi-pencil"></i> Редагувати
            </RouterLink>
            <BaseButton variant="secondary" @click="isDeleteOpen = true">
              <i class="bi bi-trash"></i> Видалити
            </BaseButton>
          </div>
        </div>

        <div v-if="deleteError" class="alert alert-danger" role="alert">{{ deleteError }}</div>

        <dl v-if="!isEditing" class="info-list">
          <template v-for="item in details" :key="item.label">
            <dt>{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
          </template>
        </dl>

        <!-- вкладений маршрут /users/:id/edit рендериться тут -->
        <RouterView :user="user" @saved="onSaved" />
      </div>
    </div>

    <ConfirmDeleteModal
      v-model:open="isDeleteOpen"
      :user="user"
      :deleting="isDeleting"
      @confirm="deleteUser"
    />
  </div>
</template>

<style scoped>
.back-link {
  display: inline-block;
  margin-bottom: 14px;
  color: #98a6ad;
  text-decoration: none;
}

.back-link:hover {
  color: var(--bs-primary);
}

.state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #6c757d;
}

.state__spinner {
  color: var(--bs-primary);
}

.profile {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.profile__avatar {
  width: 72px;
  height: 72px;
  object-fit: cover;
  background-color: #f4f4f4;
  border-radius: 50%;
}

.profile__avatar--initials {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.4rem;
  font-weight: 700;
  background-color: var(--bs-primary);
}

.profile__main {
  flex: 1;
  min-width: 200px;
}

.profile__name {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
}

.profile__meta {
  margin: 0;
  color: #98a6ad;
}

.profile__actions {
  display: flex;
  gap: 8px;
}

.info-list {
  display: grid;
  grid-template-columns: 9rem 1fr;
  gap: 8px 16px;
  margin: 0;
}

.info-list dt {
  color: #98a6ad;
  font-weight: 600;
}

.info-list dd {
  margin: 0;
}
</style>
