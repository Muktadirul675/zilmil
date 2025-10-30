<template>
  <template v-if="auth.isAdmin">
    <div class="bg-yellow-300 hidden"></div>
    <div
      :class="`flex items-center gap-2 px-3 py-1 rounded text-sm font-medium bg-${bgColor}-300 text-${bgColor}-600 font-semibold`"
    >
      <i class="pi pi-bolt"></i>
      Active {{ actives.activeUsers.length }}/{{ actives.activeUsers.length + actives.inactiveUsers.length }}
    </div>
  </template>
</template>

<script setup>
import { useActiveUsersStore } from '@/stores/active';
import { useAuthStore } from '@/stores/auth';
import { computed } from 'vue';

const actives = useActiveUsersStore()
const auth = useAuthStore()

const bgColor = computed(() => {
  const a = actives.activeUsers.length
  const b = actives.inactiveUsers.length
  const total = a + b

  if (total === 0) return 'gray' // fallback when no users

  const level = (a / total) * 100

  if (level < 30) return 'red'
  if (level < 50) return 'yellow'
  if (level < 80) return 'blue'
  return 'green'
})

</script>
