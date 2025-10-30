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
            <div v-if="last_active" class="text-sm font-">
                Last Active: {{ new Date(last_active).toLocaleString() }}
            </div>
        </div>
    </div>
</template>
