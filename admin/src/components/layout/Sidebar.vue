<template>
  <aside class="w-fit transition-all bg-gray-800 text-white h-screen sticky top-0">
    <div class="text-2xl text-center flex items-center gap-2 font-bold p-4 border-b border-gray-700">
      <div @click="minimized = !minimized"
        :class="`hover:bg-gray-700 p-2 cursor-pointer text-lg rounded flex items-center ${minimized ? '' : 'space-x-2'}`">
        <i v-if="!minimized" class="pi pi-arrow-left"></i>
        <i v-if="minimized" class="pi pi-arrow-right"></i>
      </div>
      <template v-if="!minimized">
        <span v-if="auth.isAdmin">Admin</span>
        <span v-else-if="auth.isStaff">Staff</span>
        <span v-else>Error</span>
      </template>
    </div>
    <nav class="mt-4 flex flex-col space-y-2 px-4">
      <RouterLink v-if="auth.isAdmin" to="/dashboard"
        :class="`hover:bg-gray-700 p-2 rounded flex items-center ${minimized ? '' : 'space-x-2'}`">
        <i class="pi pi-home"></i>
        <span v-if="!minimized">Dashboard</span>
      </RouterLink>

      <RouterLink v-if="auth.isAdmin" to="/users"
        :class="`hover:bg-gray-700 p-2 rounded flex items-center ${minimized ? '' : 'space-x-2'}`">
        <i class="pi pi-users"></i>
        <span v-if="!minimized">Users</span>
      </RouterLink>

      <RouterLink v-if="auth.isAdmin" to="/reports/staff"
        :class="`hover:bg-gray-700 p-2 rounded flex items-center ${minimized ? '' : 'space-x-2'}`">
        <i class="pi pi-users"></i>
        <span v-if="!minimized">Staff Report</span>
      </RouterLink>

      <RouterLink v-if="auth.isAdmin" to="/products"
        :class="`hover:bg-gray-700 p-2 rounded flex items-center ${minimized ? '' : 'space-x-2'}`">
        <i class="pi pi-box"></i>
        <span v-if="!minimized">Products</span>
        <div class="ms-auto">
          <div class="flex items-center flex-row gap-3 text-sm">
            <div v-if="products.low_stocks.length" class="">
              <i class="pi pi-exclamation-circle me-2"></i>
              <span v-if="!minimized">{{ products.low_stocks.length }}</span>
            </div>
            <div v-if="products.unavailables.length" class="">
              <i class="pi pi-times-circle me-2"></i>
              <span v-if="!minimized">{{ products.unavailables.length }}</span>
            </div>
          </div>
        </div>
      </RouterLink>

      <RouterLink v-if="auth.isAdmin || auth.isStaff" to="/orders"
        :class="`hover:bg-gray-700 p-2 rounded flex items-center ${minimized ? '' : 'space-x-2'}`">
        <i class="pi pi-shopping-cart"></i>
        <span v-if="!minimized">Orders</span>
      </RouterLink>

      <RouterLink v-if="auth.isAdmin" to="/dashboard/orders"
        :class="`hover:bg-gray-700 p-2 rounded flex items-center ${minimized ? '' : 'space-x-2'}`">
        <i class="pi pi-shopping-cart"></i>
        <span v-if="!minimized">Orders Overview</span>
      </RouterLink>

      <RouterLink v-if="auth.isAdmin || auth.isStaff" to="/couriers"
        :class="`hover:bg-gray-700 p-2 rounded flex items-center ${minimized ? '' : 'space-x-2'}`">
        <i class="pi pi-truck"></i>
        <span v-if="!minimized">Courier</span>
      </RouterLink>

      <RouterLink v-if="auth.isAdmin" to="/logs"
        :class="`hover:bg-gray-700 p-2 rounded flex items-center ${minimized ? '' : 'space-x-2'}`">
        <i class="pi pi-file"></i>
        <span v-if="!minimized">Logs</span>
      </RouterLink>

      <RouterLink v-if="auth.isAdmin" to="/builder"
        :class="`hover:bg-gray-700 p-2 rounded flex items-center ${minimized ? '' : 'space-x-2'}`">
        <i class="pi pi-th-large"></i>
        <span v-if="!minimized">Builder</span>
      </RouterLink>

      <RouterLink v-if="auth.isAdmin" to="/settings"
        :class="`hover:bg-gray-700 p-2 rounded flex items-center ${minimized ? '' : 'space-x-2'}`">
        <i class="pi pi-sliders-h"></i>
        <span v-if="!minimized">Settings</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useProductStore } from '@/stores/products';
import { ref } from 'vue';
import { RouterLink } from 'vue-router'
const products = useProductStore()
const auth = useAuthStore()

const minimized = ref(false)

</script>