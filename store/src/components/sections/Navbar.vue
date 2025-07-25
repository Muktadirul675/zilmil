<script setup>
import { useFeedStore } from '@/stores/feed'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  id: Number
})

const feedStore = useFeedStore()
const section = computed(() => feedStore.feed.find((s) => s.id === props.id))
</script>

<template>
  <nav class="bg-white sticky top-0 shadow px-3 lg:px-6 py-3 flex items-center justify-center z-10">
    <div class="flex w-full lg:w-[80%] justify-between">
      <div class="flex items-center gap-3">
        <RouterLink to="/">
          <img
            v-if="section?.args"
            :src="section.args.preview || `${import.meta.env.VITE_BACKEND_URL}${section.args.logo}`"
            alt="Logo"
            class="h-8 w-auto"
          />
        </RouterLink>
        <span class="text-xl font-semibold text-gray-800"></span>
      </div>
      <ul class="flex gap-6 text-gray-700 font-medium">
        <a href="#" class="hover:text-red-500">
          <i class="pi pi-shopping-cart text-2xl"></i>
        </a>
      </ul>
    </div>
  </nav>
</template>