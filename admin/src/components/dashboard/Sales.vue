<template>
  <section class="w-full max-w-[90vw] mx-auto py-8">

    <div class="flex flex-col md:flex-row gap-8">
      <!-- Left: Summary Cards -->
      <div class="md:w-1/5 flex flex-col gap-4">
        <div v-for="card in summaryCards" :key="card.title"
          class="flex items-center gap-4 p-4 rounded-lg border border-gray-300 shadow-sm hover:shadow-md transition-shadow bg-white">
          <div :class="['p-3 rounded-md text-white', card.bg]">
            <component :is="card.icon" class="w-6 h-6" />
          </div>
          <div>
            <p class="text-xs text-gray-500 uppercase tracking-wide">{{ card.title }}</p>
            <p v-if="card.title === 'Total Sales'" class="text-lg font-semibold text-gray-800">
              <BDT :amount="card.value" />
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
        <div class="flex flex-wrap gap-4 items-center">
          <button @click="today"
            :class="`px-5 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded-md text-sm font-semibold transition ${highlight === 't' && 'bg-indigo-600 hover:bg-indigo-700 text-white'}`">
            Today
          </button>
          <button @click="yesterday"
            :class="`px-5 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded-md text-sm font-semibold transition ${highlight === 'y' && 'bg-indigo-600 hover:bg-indigo-700 text-white'}`">
            Yesterday
          </button>
          <button @click="()=>daysAgo(30)"
            :class="`px-5 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded-md text-sm font-semibold transition ${highlight === '30d' && 'bg-indigo-600 hover:bg-indigo-700 text-white'}`">
            30d
          </button>
          <input type="date" v-model="store.startDate"
            class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
            <input type="date" v-model="store.endDate"
            class="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
          <button @click="apply"
            class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-semibold transition">
            Apply
          </button>
          <button v-if="store.startDate || store.endDate" @click="clear"
            class="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-black rounded-md text-sm font-semibold transition">Clear</button>
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
const query = ref('')
const highlight = ref('')

async function apply() {
  await Promise.all([
    store.fetchSummary(),
    store.fetchSalesReport()
  ])
  highlight.value = query.value
  query.value = ''
}

onMounted(() => {
  apply()
})

function formatDate(date) {
  return date.toISOString().split('T')[0] // returns "YYYY-MM-DD"
}

async function today() {
  const now = new Date()
  const dateStr = formatDate(now)

  store.startDate = dateStr
  store.endDate = dateStr
  apply()
  query.value = 't'
}

async function yesterday() {
  const date = new Date()
  date.setDate(date.getDate() - 1)

  const dateStr = formatDate(date)

  store.startDate = dateStr
  store.endDate = dateStr
  apply()
  query.value = 'y'
}

function daysAgo(days) {
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - (days-1)) // include today
  store.startDate = formatDate(start)
  store.endDate = formatDate(end)
  apply()
  query.value = '30d'
}
function clear() {
  store.clear()
  apply()
  query.value = ''
}

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