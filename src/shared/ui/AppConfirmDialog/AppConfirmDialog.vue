<script setup lang="ts">
import Dialog from 'primevue/dialog'
import AppButton from '../AppButton/AppButton.vue'

withDefaults(
  defineProps<{
    header: string
    message?: string
    confirmLabel?: string
    cancelLabel?: string
    /** Іде операція: кнопка підтвердження показує спінер. */
    loading?: boolean
  }>(),
  {
    confirmLabel: 'Так',
    cancelLabel: 'Ні',
  },
)

const emit = defineEmits<{
  confirm: []
}>()

const visible = defineModel<boolean>('visible', { required: true })
</script>

<template>
  <!-- Dialog сам закривається клавішею Esc і кліком по затемненню -->
  <Dialog
    v-model:visible="visible"
    :header="header"
    modal
    dismissable-mask
    :draggable="false"
    class="app-confirm-dialog"
  >
    <p class="app-confirm-dialog__message">
      <slot>{{ message }}</slot>
    </p>
    <template #footer>
      <AppButton
        :label="cancelLabel"
        severity="secondary"
        variant="outlined"
        @click="visible = false"
      />
      <AppButton
        :label="confirmLabel"
        severity="danger"
        :loading="loading"
        @click="emit('confirm')"
      />
    </template>
  </Dialog>
</template>

<style scoped lang="scss">
.app-confirm-dialog__message {
  margin: 0;
}
</style>
