<template>
  <div class="w-full my-2 p-4 bg-white shadow rounded border border-gray-200">
    <div class="text-red-500 text-green-500 text-yellow-500 hidden"></div>

    <!-- Invalid Number -->
    <!-- {{ data }} -->
    <div v-if="isInvalidBDNumber(number)" class="text-red-500 mb-2">
      Invalid Number
    </div>

    <!-- Loading -->
    <div v-else-if="isLoading" class="text-gray-500 text-center flex items-center justify-center w-full mb-2">
      <i class="pi pi-spin pi-spinner text-blue-500 me-2"></i>
      Loading...
    </div>

    <!-- Error -->
    <div v-else-if="!data" class="text-red-600 text-center mb-2">
      Error or no data
    </div>

    <!-- Success -->
    <div v-else>
      <h2 class="text-xl font-semibold mb-4">Courier Fraud Report</h2>

      <!-- Aggregated Summary of all couriers except Own Records -->
      <div class="text-sm text-gray-700 mb-4 flex flex-wrap gap-4">
        <p><strong>Total:</strong> {{ summary['Total Parcels'] }}</p>
        <p><strong>Success:</strong> {{ summary['Total Delivered'] }}</p>
        <p><strong>Cancelled:</strong> {{ summary['Total Canceled'] }}</p>
        <p><strong>Success Ratio:</strong> {{ successRatio }}%</p>
      </div>

      <!-- Courier Table (all records including Own Records) -->
      <div class="overflow-x-auto">
        <table class="min-w-full border border-gray-300 text-sm text-gray-800">
          <thead class="bg-blue-200">
            <tr>
              <th class="p-2 text-left">Courier</th>
              <th class="p-2 text-center">Total</th>
              <th class="p-2 text-center">Success</th>
              <th class="p-2 text-center">Cancelled</th>
              <th class="p-2 text-center">Cancel Rate</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-300">
            <tr v-for="(courier, key) in data" :key="key" class="hover:bg-gray-50 transition p-3 py-2">
              <td class="p-2"> <img :src="`/${courierImage[key] || 'logo.png'}`" class="h-[20px]" alt=""></td>
              <td class="p-2 text-center">{{ courier['Total Parcels'] || 0 }}</td>
              <td class="p-2 text-center">{{ courier['Total Delivered'] || 0 }}</td>
              <td class="p-2 text-center">{{ courier['Total Canceled'] || 0 }}</td>
              <td :class="`p-2 flex justify-center items-center ${textColor(courier['Total Parcels'] > 0
                ? (Math.round((courier['Total Canceled'] / courier['Total Parcels']) * 100))
                : 0)}`">
                <div :class="`${bgColor(courier['Total Parcels'] > 0
                  ? (Math.round((courier['Total Canceled'] / courier['Total Parcels']) * 100))
                  : 0)} rounded-full w-[60px] font-semibold text-center px-2 py-1.5`">
                  {{ courier['Total Parcels'] > 0
                    ? (Math.round((courier['Total Canceled'] / courier['Total Parcels']) * 100))
                    : 0
                  }}%
                </div>
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
import { useHorinStore } from '@/stores/horin'
import { isInvalidBDNumber } from '@/services/utils'

const props = defineProps({
  number: String
})

const number = toRef(props, 'number')
const isLoading = ref(true)
const store = useHorinStore()
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
    console.log(res)
    data.value = res || {}
    console.log(data.value)
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

const courierImage = {
  'Pathao': 'pathao.svg',
  'Steadfast': 'sf.svg',
  'Paperfly': 'ppf.svg',
  'RedX': 'redx.svg',
}

// Aggregate summary of all couriers except "Own Records"
const summary = computed(() => {
  const couriers = filteredCouriers.value
  const total = Object.values(couriers).reduce((acc, c) => acc + (c['Total Parcels'] || 0), 0)
  const delivered = Object.values(couriers).reduce((acc, c) => acc + (c['Total Delivered'] || 0), 0)
  const cancelled = Object.values(couriers).reduce((acc, c) => acc + (c['Total Canceled'] || 0), 0)

  return {
    'Total Parcels': total,
    'Total Delivered': delivered,
    'Total Canceled': cancelled
  }
})

// Success ratio
const successRatio = computed(() => {
  const delivered = summary.value['Total Delivered'] || 0
  const total = summary.value['Total Parcels'] || 0
  return total > 0 ? Math.round((delivered / total) * 100) : 0
})

const failedRatio = computed(() => 100 - successRatio.value)

const textColor = (ratio) => {
  if (ratio < 20) return 'text-green-500'
  if (ratio < 50) return 'text-yellow-500'
  return 'text-red-500'
}

const bgColor = (ratio) => {
  if (ratio < 20) return 'bg-green-200/90'
  if (ratio < 50) return 'bg-yellow-200/90'
  return 'bg-red-200/90'
}
</script>