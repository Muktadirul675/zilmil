<template>
  <div class="w-full flex flex-col items-center gap-2">
    <!-- Circular Progress -->
    <div v-if="isInvalidBDNumber(props.number)">
      <div class="text-red-500">Invalid Number</div>
    </div>
    <div v-else class="relative w-16 h-16">
      <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
        <!-- Background Circle -->
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="gray"
          stroke-opacity="0.2"
          stroke-width="10"
          fill="none"
        />
        <!-- Foreground Circle -->
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke-width="10"
          fill="none"
          stroke-linecap="round"
          :stroke="color"
          :stroke-dasharray="strokeDashArray"
          stroke-dashoffset="0"
        />
      </svg>

      <!-- Percentage in the center -->
      <div :class="`absolute inset-0 flex items-center justify-center text-sm font-semibold text-gray-700 ${textColor(parseInt(ratio))}`">
        {{ ratio }}%
      </div>
    </div>

    <!-- Delivered / Total below the circle -->
    <div v-if="summary" class="text-sm text-gray-700">
      {{ summary.DeliveredParcels || summary['Total Delivered'] || 0 }}
      /
      {{ summary.TotalParcels || summary['Total Parcels'] || 0 }}
    </div>

    <!-- Loading / Error -->
    <div v-if="isLoading" class="text-gray-500 flex items-center gap-1 mt-2">
      <i class="pi pi-spin pi-spinner text-blue-500"></i> Loading...
    </div>
    <div v-else-if="!summary" class="text-red-600 text-center mt-2">
      Error
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, toRef } from 'vue'
import { useHorinStore } from '@/stores/horin'
import { isInvalidBDNumber } from '@/services/utils'

const props = defineProps({
  number: {
    type: String,
    required: true
  }
})

const number = toRef(props, 'number')
const isLoading = ref(true)

// Pinia store
const courierStore = useHorinStore()
const summary = ref(null)
const textColor = (ratio)=>{
  if(ratio < 50) return 'text-red-500'
  if(ratio < 80) return 'text-yellow-500'
  return 'text-green-500'
}
// Function to load parcels from store
const loadParcels = async (phone) => {
  if (!phone || isInvalidBDNumber(phone)) {
    isLoading.value = false;
    return;
  }
  isLoading.value = true
  try {
    const data = await courierStore.getParcels(phone)
    summary.value = data
  } catch (e) {
    summary.value = null
    console.error('Error fetching parcels from store:', e)
  } finally {
    isLoading.value = false
  }
}

// Watch phone number and fetch data when valid
watch(number, () => {
  if (number.value && number.value.length >= 11) {
    loadParcels(number.value)
  }
}, { immediate: true })

// Compute success ratio
const ratio = computed(() => {
  if (!summary.value) return 0
  const delivered = summary.value.DeliveredParcels || summary.value['Total Delivered'] || 0
  const total = summary.value.TotalParcels || summary.value['Total Parcels'] || 0
  return total > 0 ? Math.round((delivered / total) * 100) : 0
})

const strokeDashArray = computed(() => `${(ratio.value / 100) * 283} 283`)
const color = computed(() => {
  if (ratio.value >= 80) return '#22c55e' // green
  if (ratio.value >= 50) return '#facc15' // yellow
  return '#ef4444'                        // red
})
</script>