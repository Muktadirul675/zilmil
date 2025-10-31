<template>
  <div v-if="orderLockStore.isLocked(props.id).value" class="flex items-center gap-1">
    <!-- Reuse CircularPulse -->
    <CircularPulse :color="'red'"/>
    <i class="text-sm pi pi-lock"></i> 
    {{ orderLockStore.isLockedBy(props.id).value }}
  </div>
</template>

<script setup>
import { useOrderLockStore } from '@/stores/orderLockStore'
import CircularPulse from '../ui/CircularPulse.vue'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  }
})

const orderLockStore = useOrderLockStore()

</script>