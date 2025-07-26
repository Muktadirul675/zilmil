<script setup>
import { RouterLink } from 'vue-router'
import ProductCard from '../product/ProductCard.vue'

const { section } = defineProps({
  section: Object
})
</script>

<template>
  <div v-if="section?.products?.length" class="my-2 flex justify-center w-full">
    <div class="w-full lg:w-4/5 p-2">
      <div class="flex flex-wrap items-center justify-between mb-2">
        <h3 class="font-semibold text-xl truncate">{{ section.title }}</h3>
        <RouterLink
          v-if="section?.category?.slug"
          :to="`/category/${section.category.slug}`"
          class="text-white rounded px-2 py-1 bg-red-500 hover:bg-red-600 transition"
        >
          See All
        </RouterLink>
      </div>

      <div class="flex flex-wrap">
        <ProductCard
          v-for="product in section.products"
          :key="product.id"
          :product="product"
          v-memo="[product.id]"
        />
      </div>
    </div>
  </div>
</template>