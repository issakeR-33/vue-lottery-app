import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { User } from '@/entities/user'

export const MAX_WINNERS = 3

// Розіграш: до трьох переможців серед учасників поточної сторінки.
// Це дія користувача (feature), тому стор лежить у features, а не в entities/user.
export const useWinnersStore = defineStore('winners', () => {
  const winners = ref<User[]>([])

  const isFull = computed(() => winners.value.length >= MAX_WINNERS)

  function isWinner(id: number): boolean {
    return winners.value.some((w) => w.id === id)
  }

  function canPick(pool: readonly User[]): boolean {
    return !isFull.value && pool.some((u) => !isWinner(u.id))
  }

  // переможець обирається серед учасників поточної сторінки, які ще не перемагали
  function pick(pool: readonly User[]): void {
    if (!canPick(pool)) return
    const available = pool.filter((u) => !isWinner(u.id))
    const chosen = available[Math.floor(Math.random() * available.length)]
    if (chosen) winners.value.push(chosen)
  }

  function remove(id: number): void {
    winners.value = winners.value.filter((w) => w.id !== id)
  }

  // після редагування учасника показуємо в списку переможців оновлені дані
  function sync(user: User): void {
    winners.value = winners.value.map((w) => (w.id === user.id ? user : w))
  }

  return { winners, isFull, canPick, pick, remove, sync }
})
