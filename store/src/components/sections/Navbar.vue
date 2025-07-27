<script setup>
import { RouterLink } from 'vue-router';
import CartIcon from '../cart/CartIcon.vue';
import SearchBox from '../navbar/SearchBox.vue';
import { ref } from 'vue';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const { section } = defineProps({
  section: Object
})

const showSearchBox = ref(false)
</script>

<template>
  <div class="flex w-full flex-col">
    <nav class="bg-white sticky top-0 shadow px-3 lg:px-6 py-3 flex items-center justify-center z-10">
      <div class="flex w-full lg:w-[80%] justify-between">
        <div class="flex items-center gap-3">
          <RouterLink to="/">
            <img v-if="section?.args" :src="section.args.preview || `${BACKEND_URL}${section.args.logo}`" alt="Logo"
              class="h-8 w-auto" />
          </RouterLink>
          <span class="text-xl font-semibold text-gray-800"></span>
        </div>
        <div class="flex flex-row items-center gap-3">
          <div class="hidden md:block">
            <SearchBox />
          </div>
          <div @click="showSearchBox = !showSearchBox" class="flex items-center md:hidden">
            <i class="pi pi-search text-xl"></i>
          </div>
          <CartIcon />
        </div>
      </div>
    </nav>
    <div :class="`md:hidden ${showSearchBox ? '' : 'overflow-hidden'} flex z-10 flex-row items-center gap-1 px-2 transition-all ${showSearchBox ? 'h-[80px]' : 'h-0'}`">
      <SearchBox @close="showSearchBox = false"/>
      <i @click="showSearchBox = false" class="pi pi-times text-xl"></i>
    </div>
  </div>
</template>