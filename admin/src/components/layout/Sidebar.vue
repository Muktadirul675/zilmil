<template>
  <aside class="w-64 bg-gray-800 text-white h-screen fixed">
    <div class="text-2xl font-bold p-4 border-b border-gray-700"><i class="pi pi-chart-line mr-2"></i> Admin</div>
    <nav class="mt-4 flex flex-col space-y-2 px-4">
      <RouterLink to="/dashboard" class="hover:bg-gray-700 p-2 rounded flex items-center space-x-2">
        <i class="pi pi-home"></i>
        <span>Dashboard</span>
      </RouterLink>

      <RouterLink to="/users" class="hover:bg-gray-700 p-2 rounded flex items-center space-x-2">
        <i class="pi pi-users"></i>
        <span>Users</span>
      </RouterLink>

      <RouterLink to="/products" class="hover:bg-gray-700 p-2 rounded flex items-center space-x-2">
        <i class="pi pi-box"></i>
        <span>Products</span>
      </RouterLink>

      <RouterLink to="/orders" class="hover:bg-gray-700 p-2 rounded flex items-center space-x-2">
        <i class="pi pi-shopping-cart"></i>
        <span>Orders</span>
      </RouterLink>

      <RouterLink to="/couriers" class="hover:bg-gray-700 p-2 rounded flex items-center space-x-2">
        <i class="pi pi-truck"></i>
        <span>Courier</span>
      </RouterLink>

      <RouterLink to="/logs" class="hover:bg-gray-700 p-2 rounded flex items-center space-x-2">
        <i class="pi pi-file"></i>
        <span>Logs</span>
      </RouterLink>

      <RouterLink to="/builder" class="hover:bg-gray-700 p-2 rounded flex items-center space-x-2">
        <i class="pi pi-th-large"></i>
        <span>Builder</span>
      </RouterLink>

      <RouterLink to="/settings" class="hover:bg-gray-700 p-2 rounded flex items-center space-x-2">
        <i class="pi pi-sliders-h"></i>
        <span>Settings</span>
      </RouterLink>
    </nav>
  </aside>
</template>
  
  <script setup>
  import { RouterLink } from 'vue-router'
  </script>