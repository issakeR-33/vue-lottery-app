<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  AppButton,
  AppCard,
  AppConfirmDialog,
  AppMessage,
  AppSpinner,
  useNotify,
} from '@/shared/ui'
import { fullName, useUsersStore, type User } from '@/entities/user'
import { useWinnersStore } from '@/features/lottery'

// id приходить з маршруту /users/:id через props: true
const props = defineProps<{
  id: string
}>()

const store = useUsersStore()
const { current: user, isCurrentLoading, currentError, listQuery } = storeToRefs(store)
const winners = useWinnersStore()
const notify = useNotify()
const route = useRoute()
const router = useRouter()

// той самий компонент перевикористовується при переході між /users/1 і /users/2
watch(
  () => props.id,
  (id) => store.fetchUser(Number(id)),
  { immediate: true },
)

const isEditing = computed(() => route.name === 'user-edit')
const backToList = computed(() => ({ name: 'users', query: listQuery.value }))

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

// стор уже оновив current, лишається синхронізувати переможців і повернутися до профілю
function onSaved(updated: User): void {
  winners.sync(updated)
  notify.success('Дані учасника оновлено', fullName(updated))
  router.push({ name: 'user', params: { id: updated.id } })
}

const isDeleteOpen = ref(false)
const isDeleting = ref(false)

async function confirmDelete(): Promise<void> {
  const target = user.value
  if (!target) return
  isDeleting.value = true
  try {
    await store.removeUser(target.id)
    winners.remove(target.id)
    notify.success('Учасника видалено', fullName(target))
    await router.push(backToList.value)
  } catch (e) {
    notify.error('Не вдалося видалити учасника', (e as Error).message)
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

    <AppCard>
      <AppSpinner v-if="isCurrentLoading" />

      <template v-else-if="currentError">
        <AppMessage>Не вдалося завантажити учасника: {{ currentError }}</AppMessage>
        <AppButton label="До списку" :to="backToList" />
      </template>

      <template v-else-if="user">
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
            <AppButton
              label="Редагувати"
              icon="bi bi-pencil"
              :to="{ name: 'user-edit', params: { id: user.id } }"
            />
            <AppButton
              label="Видалити"
              icon="bi bi-trash"
              severity="danger"
              variant="outlined"
              @click="isDeleteOpen = true"
            />
          </div>
        </div>

        <dl v-if="!isEditing" class="info-list">
          <template v-for="item in details" :key="item.label">
            <dt>{{ item.label }}</dt>
            <dd>{{ item.value }}</dd>
          </template>
        </dl>

        <!-- вкладений маршрут /users/:id/edit рендериться тут -->
        <RouterView :user="user" @saved="onSaved" />
      </template>
    </AppCard>

    <AppConfirmDialog
      v-model:visible="isDeleteOpen"
      header="Видалення учасника"
      :loading="isDeleting"
      @confirm="confirmDelete"
    >
      <template v-if="user">
        Ви дійсно бажаєте видалити учасника "{{ fullName(user) }}", "{{ user.email }}"?
      </template>
    </AppConfirmDialog>
  </div>
</template>

<style scoped lang="scss">
.back-link {
  display: inline-block;
  margin-bottom: 14px;
  color: var(--p-text-muted-color);
  text-decoration: none;

  &:hover {
    color: var(--p-primary-color);
  }
}

.profile {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;

  &__avatar {
    width: 72px;
    height: 72px;
    object-fit: cover;
    background-color: var(--p-content-hover-background);
    border-radius: 50%;

    &--initials {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--p-primary-contrast-color);
      font-size: 1.4rem;
      font-weight: 700;
      background-color: var(--p-primary-color);
    }
  }

  &__main {
    flex: 1;
    min-width: 200px;
  }

  &__name {
    margin: 0;
    font-size: 1.4rem;
    font-weight: 700;
  }

  &__meta {
    margin: 0;
    color: var(--p-text-muted-color);
  }

  &__actions {
    display: flex;
    gap: 8px;
  }
}

.info-list {
  display: grid;
  grid-template-columns: 9rem 1fr;
  gap: 8px 16px;
  margin: 0;

  dt {
    color: var(--p-text-muted-color);
    font-weight: 600;
  }

  dd {
    margin: 0;
  }
}
</style>
