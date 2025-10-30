<template>
  <div class="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1 text-sm font-medium">
    <i class="pi pi-bolt text-blue-500"></i>
    <span>{{ viewers.length }} viewing</span>
    <div v-if="viewers.length" class="flex gap-1 flex-wrap max-w-[220px] overflow-x-auto">
      <span 
        v-for="(user, index) in viewers" 
        :key="index"
        class="bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full text-xs whitespace-nowrap"
      >
        {{ user }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  viewers: {
    type: Array,
    default: () => [],
  },
})
</script>

<style scoped>
/* optional scrollbar styling */
.flex-wrap::-webkit-scrollbar {
  height: 4px;
}

.flex-wrap::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
}
</style>