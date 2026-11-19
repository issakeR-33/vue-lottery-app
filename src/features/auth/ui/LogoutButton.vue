<script setup lang="ts">
import { useRouter } from 'vue-router'
import { AppButton } from '@/shared/ui'
import { useSessionStore } from '@/entities/session'

const router = useRouter()
const session = useSessionStore()

function logout(): void {
  session.clearSession()
  router.push({ name: 'login' })
}
</script>

<template>
  <AppButton label="Logout" variant="outlined" size="small" @click="logout" />
</template>
