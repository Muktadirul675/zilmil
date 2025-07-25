<template>
  <div class="w-full flex justify-center" v-if="slides.length">
    <div class="w-full lg:w-[80%] relative">
      <!-- Scrollable Container -->
      <div
        ref="sliderRef"
        class="flex justify-center gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 scrollbar-hide"
      >
        <RouterLink
          v-for="slide in slides"
          :key="slide.id"
          :to="slide.link"
          class="flex flex-col items-center justify-center min-w-[80px] snap-start"
        >
          <img
            :src="slide.preview || `${BACKEND_URL}${slide.image}`"
            class="w-12 h-12 object-contain"
            alt="category"
          />
          <div class="text-sm text-center mt-1">{{ slide.caption }}</div>
        </RouterLink>
      </div>

      <!-- Controls -->
      <div
        class="absolute top-1/2 left-0 -translate-y-1/2 z-1 p-1 bg-white/80 hover:bg-white rounded-full cursor-pointer"
        click="scrollLeft"
      >
        <i class="pi pi-angle-left"></i>
      </div>
      <div
        class="absolute top-1/2 right-0 -translate-y-1/2 z-1 p-1 bg-white/80 hover:bg-white rounded-full cursor-pointer"
        click="scrollRight"
      >
        <i class="pi pi-angle-right"></i>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useFeedStore } from '@/stores/feed'
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const props = defineProps({
  id: Number
})

const feedStore = useFeedStore()
const section = computed(() => feedStore.feed.find(s => s.id === props.id))
const slides = computed(() => section.value?.slides || [])

const sliderRef = ref(null)

const scrollLeft = () => {
  sliderRef.value?.scrollBy({ left: -200, behavior: 'smooth' })
}
const scrollRight = () => {
  sliderRef.value?.scrollBy({ left: 200, behavior: 'smooth' })
}
</script>

<style scoped>
/* Hide scrollbar */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>