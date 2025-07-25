<script setup>
import { useCartStore } from '@/stores/cart';
import { useFeedStore } from '@/stores/feed'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import CartIcon from '../cart/CartIcon.vue';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const props = defineProps({
  id: Number
})

const feedStore = useFeedStore()
const cart = useCartStore()
const section = computed(() => feedStore.feed.find((s) => s.id === props.id))
</script>

<template>
  <nav class="bg-white sticky top-0 shadow px-3 lg:px-6 py-3 flex items-center justify-center z-10">
    <div class="flex w-full lg:w-[80%] justify-between">
      <div class="flex items-center gap-3">
        <RouterLink to="/">
          <img
            v-if="section?.args"
            :src="section.args.preview || `${BACKEND_URL}${section.args.logo}`"
            alt="Logo"
            class="h-8 w-auto"
          />
        </RouterLink>
        <span class="text-xl font-semibold text-gray-800"></span>
      </div>
      <CartIcon/>
    </div>
  </nav>
</template>