<template>
  <div class="w-full my-2 p-4 bg-white shadow rounded border border-gray-200">
    <!-- Invalid Number -->
    <div v-if="isInvalidBDNumber(number)" class="text-red-500 mb-2">
      Invalid Number
    </div>

    <!-- Loading -->
    <div v-else-if="isLoading" class="text-gray-500 text-center flex items-center justify-center w-full mb-2">
      <i class="pi pi-spin pi-spinner text-blue-500 me-2"></i>
      Loading...
    </div>

    <!-- Error -->
    <div v-else-if="!data.value || Object.keys(data.value).length === 0" class="text-red-600 text-center mb-2">
      Error or no data
    </div>

    <!-- Success -->
    <div v-else>
      <h2 class="text-xl font-semibold mb-4">Courier Fraud Report</h2>

      <!-- Aggregated Summary of all couriers except Own Records -->
      <div class="text-sm text-gray-700 mb-4 flex flex-wrap gap-4">
        <p><strong>Total:</strong> {{ summary['Total Parcels'] }}</p>
        <p><strong>Success:</strong> {{ summary['Delivered Parcels'] }}</p>
        <p><strong>Cancelled:</strong> {{ summary['Canceled Parcels'] }}</p>
        <p><strong>Success Ratio:</strong> {{ successRatio }}%</p>
      </div>

      <!-- Courier Table (all records including Own Records) -->
      <div class="overflow-x-auto">
        <table class="min-w-full border border-gray-300 text-sm text-gray-800">
          <thead class="bg-gray-100">
            <tr>
              <th class="p-2 text-left">Courier</th>
              <th class="p-2 text-center">Total</th>
              <th class="p-2 text-center">Success</th>
              <th class="p-2 text-center">Cancelled</th>
              <th class="p-2 text-center">Success Ratio</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(courier, key) in data.value" :key="key" class="hover:bg-gray-50 transition">
              <td class="p-2">{{ key }}</td>
              <td class="p-2 text-center">{{ courier['Total Parcels'] || 0 }}</td>
              <td class="p-2 text-center">{{ courier['Delivered Parcels'] || 0 }}</td>
              <td class="p-2 text-center">{{ courier['Canceled Parcels'] || 0 }}</td>
              <td class="p-2 text-center">
                {{ courier['Total Parcels'] > 0 
                    ? Math.round((courier['Delivered Parcels'] / courier['Total Parcels']) * 100)
                    : 0
                }}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, toRef } from 'vue'
import { useCourierStore } from '@/stores/courier'
import { isInvalidBDNumber } from '@/services/utils'

const props = defineProps({
  number: String
})

const number = toRef(props, 'number')
const isLoading = ref(true)
const store = useCourierStore()
const data = ref({})

// Load data from store
const loadData = async (phone) => {
  if (!phone || isInvalidBDNumber(phone)) {
    isLoading.value = false;
    return;
  }
  isLoading.value = true
  try {
    const res = await store.getCouriers(phone)
    data.value = res || {}
  } catch (e) {
    console.error('Error fetching courier summary:', e)
    data.value = {}
  } finally {
    isLoading.value = false
  }
}

// Watch number changes
watch(number, () => {
  if (number.value && number.value.length >= 11) {
    loadData(number.value)
  }
}, { immediate: true })

// Filter couriers (exclude "Own Records") for aggregated summary
const filteredCouriers = computed(() => {
  const copy = { ...data.value }
  delete copy['Own Records']
  return copy
})

// Aggregate summary of all couriers except "Own Records"
const summary = computed(() => {
  const couriers = filteredCouriers.value
  const total = Object.values(couriers).reduce((acc, c) => acc + (c['Total Parcels'] || 0), 0)
  const delivered = Object.values(couriers).reduce((acc, c) => acc + (c['Delivered Parcels'] || 0), 0)
  const cancelled = Object.values(couriers).reduce((acc, c) => acc + (c['Canceled Parcels'] || 0), 0)

  return {
    'Total Parcels': total,
    'Delivered Parcels': delivered,
    'Canceled Parcels': cancelled
  }
})

// Success ratio
const successRatio = computed(() => {
  const delivered = summary.value['Delivered Parcels'] || 0
  const total = summary.value['Total Parcels'] || 0
  return total > 0 ? Math.round((delivered / total) * 100) : 0
})
</script>