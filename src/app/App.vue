<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { AppToast } from '@/shared/ui'
import DefaultLayout from '@/app/layouts/DefaultLayout.vue'
import AuthLayout from '@/app/layouts/AuthLayout.vue'

const layouts = {
  default: DefaultLayout,
  auth: AuthLayout,
}

const route = useRoute()

// layout обирається полем meta.layout поточного маршруту
const layout = computed(() => layouts[route.meta.layout ?? 'default'])
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
  <AppToast />
</template>
