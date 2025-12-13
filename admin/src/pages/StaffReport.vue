<template>
  <div>
    <h1 class="text-2xl font-bold flex items-center gap-2 mb-2">
      <div class="flex items-center gap-2">
        <i class="pi pi-users text-indigo-600"></i>
        Confirmed Orders by Users
      </div>

      <input
        v-model="search"
        @input="onSearch"
        type="text"
        placeholder="Search by username"
        class="border bg-white border-gray-300 rounded px-3 text-sm text-slate-600 font-normal py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <div v-if="loading">
        <i class="pi pi-spin pi-spinner text-sm px-3 text-center text-indigo-600"></i>
      </div>
    </h1>

<!-- Filters Row -->
<div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
  <div class="flex items-center gap-3">
    <div class="text-sm font-medium text-gray-700">From</div>
    <input
      type="date"
      v-model="startDate"
      class="border bg-white border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
    <div class="text-sm font-medium text-gray-700">To</div>
    <input
      type="date"
      v-model="endDate"
      class="border bg-white border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />

    <!-- Apply & Today buttons -->
    <button
      @click="applyFilters"
      class="bg-indigo-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-indigo-700"
    >
      <i class="pi pi-filter" /> Apply
    </button>
    <button
      @click="resetToToday"
      class="bg-indigo-600 text-white px-3 py-2 rounded cursor-pointer hover:bg-indigo-700"
    >
      Today
    </button>

    <!-- New buttons -->
    <button
      @click="setYesterday"
      class="bg-gray-200 text-gray-800 px-3 py-2 rounded cursor-pointer hover:bg-gray-300"
    >
      Yesterday
    </button>
    <button
      @click="setLast30Days"
      class="bg-gray-200 text-gray-800 px-3 py-2 rounded cursor-pointer hover:bg-gray-300"
    >
      30d
    </button>
    <button
      @click="clearDates"
      class="bg-gray-200 text-gray-800 px-3 py-2 rounded cursor-pointer hover:bg-gray-300"
    >
      Clear
    </button>
  </div>

  <div class="flex items-center gap-2">
    <button @click="fetchData" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
      <i class="pi pi-refresh" />
    </button>
  </div>
</div>
    <!-- Results Table -->
    <div class="overflow-x-auto bg-white rounded shadow">
      <table class="min-w-full w-full divide-y divide-gray-200">
        <thead class="bg-slate-700 text-white">
          <tr>
            <th class="pl-4 py-3 text-center w-10">#</th>
            <th class="px-6 py-3 text-xs font-medium uppercase text-center tracking-wider">Username</th>
            <th class="px-6 py-3 text-xs font-medium uppercase text-center tracking-wider">Confirmed</th>
            <th class="px-6 py-3 text-xs font-medium uppercase text-center tracking-wider">Delivered</th>
            <th class="px-6 py-3 text-xs font-medium uppercase text-center tracking-wider">Returned</th>
            <th class="px-6 py-3 text-xs font-medium uppercase text-center tracking-wider">Success Ratio</th>
            <!-- <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th> -->
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-300">
          <template v-for="user in paginatedUsers" :key="user.id">
            <tr class="hover:bg-gray-50 cursor-pointer">
              <td class="pl-4 py-4 w-10 text-sm text-gray-900 text-center">{{ user.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">{{ user.username }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">{{ user.confirmed_count }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">{{ user.delivered_count }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">{{ user.returned_count }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900" :class="textColor(user.confirmed_count > 0 ? (parseFloat((user.delivered_count / user.confirmed_count)*100)).toFixed(2): 0)">{{ user.confirmed_count > 0 ? (parseFloat((user.delivered_count / user.confirmed_count)*100)).toFixed(2) : 0 }}%</td>
              <!-- <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  @click="goToUserOrders(user)"
                  class="bg-indigo-100 text-indigo-800 px-3 py-1 rounded text-sm hover:bg-indigo-200"
                >
                  View Orders
                </button>
              </td> -->
            </tr>
          </template>

          <tr v-if="!filteredUsers.length && !loading">
            <td colspan="4" class="px-6 py-4 text-center text-gray-500">No users found.</td>
          </tr>

          <tr v-if="error">
            <td colspan="4" class="px-6 py-4 text-center text-red-600">{{ error }}</td>
          </tr>

          <tr v-if="loading">
            <td colspan="4" class="px-6 py-4 text-center text-indigo-600">Loading...</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Simple Pagination Controls -->
    <div class="flex justify-between items-center mt-4">
      <div class="text-gray-700">
        Showing {{ pageStart }} - {{ pageEnd }} of {{ filteredUsers.length }} users
      </div>

      <nav class="space-x-2">
        <button @click="prevPage" :disabled="currentPage === 1 || loading"
          class="px-3 py-1 rounded cursor-pointer border border-gray-300 hover:bg-gray-100 disabled:opacity-50">
          Previous
        </button>

        <button
          v-for="p in pageArray"
          :key="p"
          @click="goToPage(p)"
          :class="[
            'px-3 py-1 rounded cursor-pointer border',
            p === currentPage ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-300 hover:bg-gray-100'
          ]"
          :disabled="loading"
        >
          {{ p }}
        </button>

        <button @click="nextPage" :disabled="currentPage === totalPages || loading"
          class="px-3 py-1 rounded cursor-pointer border border-gray-300 hover:bg-gray-100 disabled:opacity-50">
          Next
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from '@/services/toast'
import api from '@/services/api'
import { useHead } from '@vueuse/head'
import { useAuthStore } from '@/stores/auth'

useHead({ title: 'Confirmed Orders - Zilmil.com.bd' })

const router = useRouter()

// State
const users = ref([]) // raw API response
const loading = ref(false)
const error = ref(null)
const search = ref('')

// Pagination state (simple client-side)
const limit = ref(10)
const currentPage = ref(1)

const startDate = ref(getToday())
const endDate = ref(getToday())

// Helpers
function getToday () {
  const d = new Date()
  return d.toISOString().slice(0, 10) // yyyy-mm-dd
}

function formatParams () {
  const params = {}
  if (startDate.value) params.start_date = startDate.value
  if (endDate.value) params.end_date = endDate.value
  // include search as well (backend may ignore; we filter client-side)
  if (search.value) params.search = search.value
  return params
}

const textColor = (ratio)=>{
  if(ratio < 50) return 'text-red-500'
  if(ratio < 80) return 'text-yellow-500'
  return 'text-green-500'
}

// Fetch data from endpoint
async function fetchData () {
  if(!(auth && auth.isAuthenticated && auth.isAdmin)) return;
  loading.value = true
  error.value = null
  const auth = useAuthStore()
  try {
    const resp = await api.get('/orders/confirms/users', { params: formatParams() })
    // Expect array like:
    // [{ id, username, confirmed_count }, ...]
    users.value = Array.isArray(resp.data) ? resp.data : []
    // Reset pagination to first page when data changes
    currentPage.value = 1
  } catch (err) {
    console.error(err)
    error.value = err?.response?.data?.detail || err.message || 'Failed to fetch data'
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}

// Search handler (debounce could be added)
function onSearch () {
  // We keep client-side search; but also re-fetch to allow server-side search if supported
  // Small UX: don't spam API â only refetch when search is empty or length >= 2
  if (search.value.length === 0 || search.value.length >= 2) {
    fetchData()
  }
}

// Apply date filters
function applyFilters () {
  // ensure start <= end
  if (startDate.value && endDate.value && startDate.value > endDate.value) {
    toast.info('Start date cannot be after end date')
    return
  }
  fetchData()
}

// Yesterday
function setYesterday() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  const y = d.toISOString().slice(0, 10)
  startDate.value = y
  endDate.value = y
  fetchData()
}

// Last 30 Days
function setLast30Days() {
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - 29) // include today
  startDate.value = start.toISOString().slice(0, 10)
  endDate.value = end.toISOString().slice(0, 10)
  fetchData()
}

// Clear date filters
function clearDates() {
  startDate.value = ''
  endDate.value = ''
  fetchData()
}

// Reset filters to today
function resetToToday () {
  startDate.value = getToday()
  endDate.value = getToday()
  fetchData()
}

// Client-side filtered list (search)
const filteredUsers = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return users.value
  return users.value.filter(u => (u.username || '').toLowerCase().includes(q) || String(u.id).includes(q))
})

// Pagination computed values
const totalPages = computed(() => Math.max(1, Math.ceil(filteredUsers.value.length / limit.value)))
const pageArray = computed(() => {
  const arr = []
  for (let i = 1; i <= totalPages.value; i++) arr.push(i)
  return arr
})
const pageStart = computed(() => (filteredUsers.value.length === 0 ? 0 : (currentPage.value - 1) * limit.value + 1))
const pageEnd = computed(() => Math.min(filteredUsers.value.length, currentPage.value * limit.value))
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * limit.value
  return filteredUsers.value.slice(start, start + limit.value)
})

// Pagination controls
function prevPage () {
  if (currentPage.value > 1) currentPage.value--
}
function nextPage () {
  if (currentPage.value < totalPages.value) currentPage.value++
}
function goToPage (p) {
  if (p >= 1 && p <= totalPages.value) currentPage.value = p
}

// Action: navigate to user's orders (you can change route)
function goToUserOrders (user) {
  // open a route that shows orders confirmed by this user and the selected date range
  // adjust route according to your app's routes
  router.push({
    path: '/orders',
    query: {
      confirmed_by: user.id,
      start_date: startDate.value,
      end_date: endDate.value
    }
  })
}

// On mount fetch initial data (defaults to today)
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
/* small tweak for table action button */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
</style>