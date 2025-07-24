<template>
  <section class="w-full max-w-[90vw] mx-auto py-8">

    <div class="flex flex-col md:flex-row gap-8">
      <!-- Left: Summary Cards -->
      <div class="md:w-1/5 flex flex-col gap-4">
        <div
          v-for="card in summaryCards"
          :key="card.title"
          class="flex items-center gap-4 p-4 rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-shadow bg-white"
        >
          <div :class="['p-3 rounded-md text-white', card.bg]">
            <component :is="card.icon" class="w-6 h-6" />
          </div>
          <div>
            <p class="text-xs text-gray-500 uppercase tracking-wide">{{ card.title }}</p>
            <p v-if="card.title === 'Total Sales'" class="text-lg font-semibold text-gray-800">
              <BDT :amount="card.value"/>
            </p>
            <p v-else class="text-lg font-semibold text-gray-800">
              {{ card.value }}
            </p>
          </div>
        </div>
      </div>

      <!-- Right: Filters + Chart -->
      <div class="md:w-4/5 bg-white rounded-xl border border-gray-300 p-6 shadow-sm">
        <!-- Filters -->
        <div class="flex flex-wrap gap-4 mb-6 items-end">
          <div>
            <label class="block text-xs text-gray-500 mb-1">Start Date</label>
            <input type="date" v-model="store.startDate" class="border border-gray-300 rounded-md px-3 py-2 text-sm w-full" />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">End Date</label>
            <input type="date" v-model="store.endDate" class="border border-gray-300 rounded-md px-3 py-2 text-sm w-full" />
          </div>
          <div>
            <label class="block text-xs text-gray-500 mb-1">Metric</label>
            <select v-model="yField" class="border border-gray-300 rounded-md px-3 py-2 text-sm w-full">
              <option value="sales">Sales (BDT)</option>
              <option value="profit">Profit (BDT)</option>
              <option value="refunds">Refunds (count)</option>
            </select>
          </div>
          <div class="self-end">
            <button
              @click="store.fetchSalesReport"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition"
            >
              Apply
            </button>
          </div>
        </div>

        <!-- Chart -->
        <div class="w-full h-[500px]">
          <LineChart v-if="yField !== 'refunds'" :chartData="lineData" />
          <BarChart v-else :chartData="barData" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSalesAnalyticsStore } from '@/stores/analytics/sales'
import LineChart from '../charts/LineChart.vue'
import BarChart from '../charts/BarChart.vue'

// Heroicons
import { CurrencyBangladeshiIcon, ChartBarIcon, BanknotesIcon, ArrowUturnLeftIcon } from '@heroicons/vue/24/solid'
import BDT from '../ui/BDT.vue'

const store = useSalesAnalyticsStore()
const yField = ref('sales')

onMounted(() => {
  store.fetchSummary()
  store.fetchSalesReport()
})

const labels = computed(() => store.report.map(r => r.day))
const values = computed(() => store.report.map(r => r[yField.value]))

const commonDataset = computed(() => [
  {
    label:
      yField.value === 'sales'
        ? 'Sales'
        : yField.value === 'profit'
        ? 'Profit'
        : 'Refunds',
    data: values.value,
    backgroundColor: yField.value === 'refunds' ? '#f97316' : '#6366f1',
    borderColor: yField.value === 'refunds' ? '#f97316' : '#6366f1',
    borderWidth: 2,
    tension: 0.4,
    fill: true,
    pointRadius: 3,
  },
])

const lineData = computed(() => ({
  labels: labels.value,
  datasets: commonDataset.value,
}))

const barData = computed(() => ({
  labels: labels.value,
  datasets: commonDataset.value,
}))

const summaryCards = computed(() => [
  {
    title: 'Total Sales',
    value: store.summary?.sales_amount ?? 0,
    bg: 'bg-indigo-600',
    icon: CurrencyBangladeshiIcon,
  },
  {
    title: 'Sales Count',
    value: store.summary?.sales_count ?? 0,
    bg: 'bg-blue-500',
    icon: ChartBarIcon,
  },
  {
    title: 'Total Profit',
    value: store.summary?.total_profit ?? 0,
    bg: 'bg-green-600',
    icon: BanknotesIcon,
  },
  {
    title: 'Refunds',
    value: store.summary?.refunds ?? 0,
    bg: 'bg-red-500',
    icon: ArrowUturnLeftIcon,
  },
])
</script>