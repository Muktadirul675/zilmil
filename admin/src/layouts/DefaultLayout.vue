<template>
  <div class="flex">
    <Sidebar />
    <div class="w-full">
      <Topbar />
      <main class="p-6 flex-1 min-h-screen bg-gray-50">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/layout/Sidebar.vue'
import Topbar from '@/components/layout/Topbar.vue'
</script>