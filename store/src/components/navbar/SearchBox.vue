<template>
  <div class="relative md:me-4 p-2 z-10 md:p-0 w-full md:mx-0">
    <div class="flex items-center border rounded border-red-500 px-4 py-2 shadow-sm bg-white">
      <input type="text" v-model="query" placeholder="Search products..."
        class="w-full md:w-[300px] outline-none text-sm bg-transparent" />
      <i v-if="loading" class="pi pi-spinner pi-spin text-gray-400 ms-auto" />
      <i v-else class="pi pi-search text-gray-500 ms-auto" />
    </div>

    <!-- Dropdown search results -->
    <div v-if="results.length && query"
      class="absolute z-50 w-full bg-white border rounded shadow mt-1 max-h-60 overflow-y-auto">
      <div @click="navigate(item.slug)" v-for="item in results" :to="`/${item.slug}`" :key="item.id"
        class="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center justify-between gap-2">
        <div class="flex flex-row items-center gap-2">
          <img :src="`${BACKEND_URL}${item.image.image}`" alt="" class="w-12 h-12 rounded">
          <div class="font-semibold">{{ item.name }}</div>
        </div>
        <div class="flex flex-col items-end">
          <span class="text-red-500">
            <BDT :amount="parseFloat(item.net_price || item.price)" />
          </span>
          <div class="text-gray-500 line-through text-xs">{{ item.net_price ? item.price : item.compared_price }}</div>
        </div>
      </div>

      <div v-if="hasMore" @click="loadMore"
        class="px-4 py-2 text-sm text-center text-blue-500 hover:underline cursor-pointer">
        Load more
      </div>
    </div>
    <div v-if="results.length && query" @click="query = ''"
      class="fixed inset-0 bg-transparent pointer-events-none">
      <div class="w-full h-full pointer-events-auto"></div>
    </div>
  </div>
</template>

<script setup>
import { useSearchStore } from '@/stores/search'
import { storeToRefs } from 'pinia'
import BDT from '../ui/BDT.vue'
import { useRouter } from 'vue-router'

const emit = defineEmits(['close'])

const searchStore = useSearchStore()
const { query, results, loading, hasMore } = storeToRefs(searchStore)
const { loadMore } = searchStore

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const router = useRouter()

function navigate(slug) {
  emit('close')
  router.push(`/product/${slug}`)
}

</script>

<style scoped>
/* Optional styles if not using Tailwind */
</style>