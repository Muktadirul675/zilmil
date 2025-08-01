<script setup>
import { RouterLink } from 'vue-router';

const { section } = defineProps({
  section: Object
})
</script>

<template>
  <div
    class="hidden lg:flex justify-center bg-red-500 text-white"
    v-if="section?.categories?.length"
  >
    <div class="w-full lg:w-[80%] flex">
      <template v-for="(cat, index) in [{ id: 'all', name: 'All Categories' }, ...section.categories]" :key="cat.id">
        <RouterLink :to="`/category/${cat.slug}`"
          class="px-3 py-2 cursor-pointer border-l border-gray-300 last:border-r hover:bg-red-600 transition-all"
          role="button"
          tabindex="0"
        >
          {{ cat.name }}
        </RouterLink>
      </template>
    </div>
  </div>
</template>