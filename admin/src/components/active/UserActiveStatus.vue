<script setup>
import { timeAgo } from '@/services/utils';
import { computed } from 'vue';

const props = defineProps({
    user_id: Number,
    all_users: Array
})

const user = computed(() => props.all_users.find((u) => u.id === props.user_id))
const active = computed(() => user.value.is_active)
const last_active = computed(() => user.value.last_active)
const formatDMYTime = (date) => {
  const d = new Date(date) // auto converts UTC â local

  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()

  let hours = d.getHours()
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'

  hours = hours % 12 || 12 // convert 0 â 12

  return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`
}
</script>

<template>
    <div v-if="user" class="flex gap-2">
        <div v-if="active"
            class="rounded px-1.5 py-[1.5px] text-sm text-green-600 font-semibold bg-green-300 flex gap-1 items-center">
            <i class="pi pi-bolt"></i>
            Active
        </div>
        <div v-else class="flex flex-col items-start gap-[3px]">
            <div
                class="rounded px-1.5 py-[1.5px] text-sm text-red-600 font-semibold bg-red-300 flex gap-1 items-center">
                <i class="pi pi-ban"></i>
                Inactive
            </div>
            <div v-if="last_active" class="text-sm">
                Last Active: {{ formatDMYTime(last_active) }}
            </div>
        </div>
    </div>
</template>
