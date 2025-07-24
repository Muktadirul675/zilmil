<template>
  <div>
    <h1 class="text-2xl font-bold flex items-center gap-2 mb-2">
      <i class="pi pi-shopping-cart  text-indigo-600"></i>
      Orders
    </h1>

    <!-- Search and Filters -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
      <input v-model="orderStore.search" @input="onSearch" type="text" placeholder="Search by name or phone"
        class="border bg-white border-gray-300 rounded px-3 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500" />

      <select v-model="orderStore.filterStatus" @change="orderStore.fetchOrders"
        class="border bg-white border-gray-300 cursor-pointer rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500">
        <option value="">All Status</option>
        <option v-for="status in statusOptions" :key="status" :value="status">
          {{ capitalize(status) }}
        </option>
      </select>


      <div class="flex flex-row gap-2 items-center">
        <div class="flex items-center gap-2">
          <label for="limit" class="text-sm font-medium text-gray-700">Per page:</label>
          <input id="limit" type="number" min="1" v-model.number="orderStore.limit" @change="onLimitChange"
            class="w-20 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <button @click="toggleFilters"
          class="bg-gray-200 text-gray-800 px-4 py-2 rounded cursor-pointer hover:bg-gray-300">
          <i class="pi pi-sliders-h mr-2" /> Filters
        </button>

        <div v-if="orderStore.selectedOrderIds.length" class="flex gap-2 items-center">
          <button @click="performBulkDelete"
            class="bg-red-600 text-white px-3 py-2 rounded cursor-pointer hover:bg-red-700" :disabled="loading">
            <i class="pi pi-trash mr-2" /> Delete Selected
          </button>

          <select v-model="selectedStatus" @change="performBulkStatusChange"
            class="border border-gray-300 rounded cursor-pointer px-3 py-2 focus:ring-2 focus:ring-indigo-500">
            <option disabled value="">Change Status</option>
            <option class="cursor-pointer" v-for="status in statusOptions" :key="status" :value="status">
              {{ capitalize(status) }}
            </option>
          </select>
        </div>

        <button @click="orderStore.fetchOrders"
          class="bg-indigo-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-indigo-700">
          <i class="pi pi-refresh mr-2" /> Refresh
        </button>
        <RouterLink to="/orders/add"
          class="bg-indigo-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-indigo-700">
          <i class="pi pi-plus mr-2" /> Add
        </RouterLink>
      </div>
    </div>

    <!-- Advanced Filters Accordion -->
    <Transition name="slide-fade">
      <div v-if="showFilters" class="bg-white border border-gray-300 rounded p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="number" v-model.number="orderStore.filters.discount_min" placeholder="Min Discount"
            class="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <input type="number" v-model.number="orderStore.filters.discount_max" placeholder="Max Discount"
            class="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <input type="datetime-local" v-model="orderStore.filters.created_after"
            class="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <input type="datetime-local" v-model="orderStore.filters.created_before"
            class="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div class="mt-4 flex gap-3">
          <button @click="applyFilters" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            Apply
          </button>
          <button @click="clearFilters" class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
            Clear
          </button>
        </div>
      </div>
    </Transition>

    <!-- Orders Table -->
    <div class="overflow-x-auto bg-white rounded shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-slate-700 text-white">
          <tr>
            <th class="pl-4 py-3 text-left w-10">
              <input type="checkbox" :checked="orderStore.areAllSelected" @change="orderStore.toggleSelectAll" />
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Order ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Customer</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Phone</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Address</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Total</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Created</th>
            <th class="px-6 py-3 w-12"></th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <template v-for="order in orderStore.orders" :key="order.id">
            <tr class="hover:bg-gray-50 cursor-pointer" @click="goToOrder(order.id)">
              <td class="pl-4 py-4 w-10" v-if="orderStore.processing_orders.includes(order.id)"><i
                  class="pi pi-spin pi-cog"></i></td>
              <td class="pl-4 py-4 w-10" v-else>
                <input type="checkbox" :checked="orderStore.selectedOrderIds.includes(order.id)"
                  @change.stop="orderStore.toggleOrderSelection(order.id)" @click.stop />
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{{ order.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ order.full_name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ order.phone }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ order.shipping_address || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span class="px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit"
                  :class="statusClass(order.status)">
                  <i :class="statusIcon(order.status)" /> {{ capitalize(order.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <!-- {{ totalPrice(order).toFixed(2) }} -->
                <BDT :amount="parseFloat(order.total_price)" />
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ new Date(order.created_at).toLocaleDateString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                <button @click.stop="toggleExpanded(order.id)"
                  class="text-indigo-600 hover:underline cursor-pointer flex items-center gap-1">
                  <i :class="expandedOrders.has(order.id) ? 'pi pi-chevron-up' : 'pi pi-chevron-down'" />
                  {{ expandedOrders.has(order.id) ? 'Hide Items' : 'Show Items' }} ({{ order.items?.length || 0 }})
                </button>
              </td>
            </tr>

            <!-- Expanded row for items -->
            <tr v-if="expandedOrders.has(order.id)" class="bg-gray-50">
              <td colspan="8" class="px-6 py-4">
                <table class="min-w-full border border-gray-300 rounded">
                  <thead class="bg-gray-200 text-gray-700">
                    <tr>
                      <th class="px-3 py-1 text-left text-xs font-semibold uppercase">Product</th>
                      <th class="px-3 py-1 text-left text-xs font-semibold uppercase">Variant</th>
                      <th class="px-3 py-1 text-left text-xs font-semibold uppercase">Color</th>
                      <th class="px-3 py-1 text-left text-xs font-semibold uppercase">Quantity</th>
                      <th class="px-3 py-1 text-left text-xs font-semibold uppercase">Price at Purchase</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in order.items" :key="item.id" class="border-t border-gray-300">
                      <td class="px-3 py-1 whitespace-nowrap text-sm">{{ item.product.name }}</td>
                      <td class="px-3 py-1 whitespace-nowrap text-sm">{{ item.variant?.name || '-' }}</td>
                      <td class="px-3 py-1 whitespace-nowrap text-sm">{{ item.color?.name || '-' }}</td>
                      <td class="px-3 py-1 whitespace-nowrap text-sm">{{ item.quantity }}</td>
                      <td class="px-3 py-1 whitespace-nowrap text-sm">
                        <BDT :amount="parseFloat(item.price_at_purchase)" />
                        <!-- {{ parseFloat(item.price_at_purchase).toFixed(2) }} -->
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="my-1"></div>
                <!-- <InvoiceButton :order="order"/> -->
              </td>
            </tr>
          </template>

          <tr v-if="orderStore.loading">
            <td colspan="8" class="px-6 py-4 text-center text-indigo-600">Loading orders...</td>
          </tr>
          <tr v-if="!orderStore.orders.length && !orderStore.loading">
            <td colspan="8" class="px-6 py-4 text-center text-gray-500">No orders found.</td>
          </tr>
          <tr v-if="orderStore.error">
            <td colspan="8" class="px-6 py-4 text-center text-red-600">{{ orderStore.error }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination Controls -->
    <div class="flex justify-between items-center mt-4">
      <div class="text-gray-700">
        Showing page {{ orderStore.currentPage }} of {{ orderStore.totalPages }} ({{ orderStore.totalCount }} orders)
      </div>

      <nav class="space-x-2">
        <button @click="orderStore.prevPage" :disabled="orderStore.currentPage === 1 || orderStore.loading"
          class="px-3 py-1 rounded cursor-pointer border border-gray-300 hover:bg-gray-100 disabled:opacity-50">
          Previous
        </button>
        <button v-for="page in pageNumbers" :key="page" @click="orderStore.goToPage(page)" :class="[
          'px-3 py-1 rounded cursor-pointer border',
          page === orderStore.currentPage
            ? 'bg-indigo-600 text-white border-indigo-600'
            : 'border-gray-300 hover:bg-gray-100',
        ]" :disabled="orderStore.loading">
          {{ page }}
        </button>
        <button @click="orderStore.nextPage"
          :disabled="orderStore.currentPage === orderStore.totalPages || orderStore.loading"
          class="px-3 py-1 rounded cursor-pointer border border-gray-300 hover:bg-gray-100 disabled:opacity-50">
          Next
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useOrderStore } from '@/stores/orders'
import { RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'
import InvoiceButton from '@/components/InvoiceButton.vue'
import BDT from '@/components/ui/BDT.vue'
const router = useRouter()

const goToOrder = (id) => {
  router.push(`/orders/${id}`)
}
const orderStore = useOrderStore()

// Local reactive state
const showFilters = ref(false)
const loading = ref(false)
const selectedStatus = ref('')
const expandedOrders = ref(new Set())

// Status options for filter and bulk status change
const statusOptions = [
  'pending',
  'confirmed',
  'processing',
  'hold',
  'shipped',
  'delivered',
  'cancelled',
  'returned',
  'shipped'
]

function statusIcon(status) {
  switch (status) {
    case 'pending': return 'pi pi-clock';
    case 'shipped': return 'pi pi-send';
    case 'delivered': return 'pi pi-check-circle';
    case 'cancelled': return 'pi pi-times-circle';
    default: return 'pi pi-info-circle';
  }
}

const onLimitChange = () => {
  if (orderStore.limit < 1) orderStore.limit = 1
  orderStore.offset = 0
  orderStore.fetchOrders()
}

// Capitalize first letter helper
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)

// Toggle advanced filters panel
const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

// Apply filters and reset pagination
const applyFilters = () => {
  orderStore.offset = 0
  orderStore.fetchOrders()
}

// Clear all filters and reset pagination
const clearFilters = () => {
  orderStore.filters = {
    discount_min: null,
    discount_max: null,
    created_after: null,
    created_before: null,
  }
  orderStore.offset = 0
  orderStore.fetchOrders()
}

// Called on search input
const onSearch = () => {
  orderStore.offset = 0
  orderStore.fetchOrders()
}

// Bulk delete selected orders
const performBulkDelete = async () => {
  if (!confirm('Are you sure you want to delete selected orders?')) return
  loading.value = true

  try {
    for (const id of orderStore.selectedOrderIds) {
      await orderStore.deleteOrder(id)
    }
    orderStore.clearSelection()
    await orderStore.fetchOrders()
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Bulk change status for selected orders
const performBulkStatusChange = async () => {
  if (!selectedStatus.value) return
  loading.value = true

  try {
    for (const id of orderStore.selectedOrderIds) {
      await orderStore.changeOrderStatus(id, selectedStatus.value)
    }
    orderStore.clearSelection()
    selectedStatus.value = ''
    await orderStore.fetchOrders()
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Status badge CSS class
const statusClass = (status) => {
  return {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-indigo-100 text-indigo-800',
    hold: 'bg-orange-100 text-orange-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }[status] || 'bg-gray-100 text-gray-800'
}

// Calculate total price of an order (sum of item price * quantity minus discount)
const totalPrice = (order) => {
  let total = 0
  for (const item of order.items || []) {
    total += parseFloat(item.price_at_purchase) * item.quantity
  }
  return total - parseFloat(order.order_discount || 0)
}

// Pagination page numbers array
const pageNumbers = computed(() => {
  const pages = []
  for (let i = 1; i <= orderStore.totalPages; i++) {
    pages.push(i)
  }
  return pages
})

// Toggle expand/collapse for order items
const toggleExpanded = (orderId) => {
  if (expandedOrders.value.has(orderId)) {
    expandedOrders.value.delete(orderId)
  } else {
    expandedOrders.value.add(orderId)
  }
  // Force update since Set is mutable
  expandedOrders.value = new Set(expandedOrders.value)
}

// Initial fetch
orderStore.fetchOrders()
</script>