<template>
  <div v-if="viewers.length > 0" class="flex items-center gap-1">
    <!-- Reuse CircularPulse -->
    <CircularPulse />
    <span class="text-sm text-gray-700">{{ viewers.length }} viewing</span>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import CircularPulse from '../ui/CircularPulse.vue'
import { usePageWS } from '@/composables/activeWs'

const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  }
})
const { viewers } = usePageWS(`/orders/${props.id}`, false)
</script>

<style scoped>
/* Optional: adjust spacing, font, etc. */
</style>