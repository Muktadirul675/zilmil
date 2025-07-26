<script setup>
defineOptions({ name: 'HomeView' })

import Loading from '@/components/ui/Loading.vue'
import ProductGridSkeleton from '@/components/ui/ProductGridSkeleton.vue'
import { useFeedStore } from '@/stores/feed'
import { computed, defineAsyncComponent } from 'vue'

const ImageSlider = defineAsyncComponent(() => import('@/components/sections/ImageSlider.vue'))
const Products = defineAsyncComponent(() => import('@/components/sections/Products.vue'))
const Category = defineAsyncComponent(() => import('@/components/sections/Category.vue'))
const CategorySlider = defineAsyncComponent(() => import('@/components/sections/CategorySlider.vue'))

const feedStore = useFeedStore()
const feedSections = computed(() => feedStore.sections)

const componentMap = {
  image_slider: ImageSlider,
  products: Products,
  category: Category,
  categories_slider: CategorySlider,
}

</script>

<template>
  <div v-show="feedSections.length">
    <div v-for="section in feedSections" :key="section.id" v-memo="[section.id, section.updated_at]">
      <Suspense>
        <template #default>
          <component :is="componentMap[section.type]" :section="section" />
        </template>
        <template #fallback>
          <ProductGridSkeleton v-if="section.type === 'category' || section.type==='products'"/>
        </template>
      </Suspense>
    </div>
  </div>
  <Loading v-show="!feedSections.length" />
</template>