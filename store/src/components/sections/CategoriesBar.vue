<script setup>
import { useFeedStore } from '@/stores/feed'
import { computed } from 'vue'

const props = defineProps({
  id: Number
})

const feedStore = useFeedStore()
const section = computed(() => feedStore.feed.find((s) => s.id === props.id))
</script>

<template>
  <div
    class="hidden lg:flex justify-center bg-red-500 text-white"
    v-if="section?.categories?.length"
  >
    <div class="w-full lg:w-[80%] flex bg-red-500">
      <div
        class="px-2 cursor-pointer py-1 border-l-[0.5px] last:border-r border-gray-300 hover:bg-red-600 transition-all"
      >
        All Categories
      </div>
      <template v-for="cat in section.categories" :key="cat.id">
        <div
          class="px-2 cursor-pointer py-1 border-l-[0.5px] last:border-r border-gray-300 hover:bg-red-600 transition-all"
        >
          {{ cat.name }}
        </div>
      </template>
    </div>
  </div>
</template>