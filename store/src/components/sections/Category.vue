<script setup>
import { computed } from 'vue'
import { useFeedStore } from '@/stores/feed'
import ProductCard from '../product/ProductCard.vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  id: Number
})

const feedStore = useFeedStore()
const section = computed(() => feedStore.feed.find((s) => s.id === props.id))
</script>

<template>
  <div class="flex w-full my-2 justify-center" v-if="section">
    <div class="w-full lg:w-4/5">
      <div class="p-2">
        <div class="flex flex-row flex-wrap justify-between">
          <h3 class="font-semibold text-xl">{{ section.title }}</h3>
          <RouterLink :to="`/category/${section.category.slug}`" class="text-white rounded cursor-pointer px-2 py-1 bg-red-500 hover:bg-red-600 transition-all">
            See All
          </RouterLink>
        </div>

        <div class="flex flex-start flex-row flex-wrap justify-start">
          <template v-for="product in section.products" :key="product.id">
            <ProductCard :product="product" />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>