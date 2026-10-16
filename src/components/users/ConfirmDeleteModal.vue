<script setup lang="ts">
import { fullName, type User } from '@/types/user'
import BaseModal from '@/components/BaseModal.vue'
import BaseButton from '@/components/BaseButton.vue'

const props = defineProps<{
  user: User | null
  deleting?: boolean
}>()

const emit = defineEmits<{
  confirm: [user: User]
}>()

const open = defineModel<boolean>('open', { required: true })

function confirm(): void {
  if (props.user) {
    emit('confirm', props.user)
  }
}
</script>

<template>
  <BaseModal v-model="open">
    <template #header>
      <h5 class="modal-title">Видалення учасника</h5>
    </template>

    <p v-if="user" class="delete-text">
      Ви дійсно бажаєте видалити учасника "{{ fullName(user) }}", "{{ user.email }}"?
    </p>

    <template #footer>
      <BaseButton variant="secondary" @click="open = false">Ні</BaseButton>
      <BaseButton :disabled="deleting" @click="confirm">Так</BaseButton>
    </template>
  </BaseModal>
</template>

<style scoped>
.delete-text {
  margin: 0;
}
</style>
