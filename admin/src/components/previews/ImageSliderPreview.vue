<script setup>
import { useBuilderStore } from '@/stores/builder';
import { computed, ref } from 'vue';
import Preview from '../Preview.vue';

const props = defineProps({
  uid: Number
})

const builder = useBuilderStore()
const section = computed(() => builder.feed.find((s) => s.uid === props.uid))

const current = ref(0)

function next() {
  current.value = (current.value + 1) % section.value.images.length
}

function prev() {
  current.value = (current.value - 1 + section.value.images.length) % section.value.images.length
}
</script>

<template>
  <Preview :uid="props.uid">
    <div class="w-full bg-slate-100 flex justify-center">
      <div class="relative w-full @lg:w-[80%] h-[40vh] overflow-hidden">

        <!-- Slides container -->
        <div
          class="flex transition-transform duration-500"
          :style="{ transform: `translateX(-${current * 100}%)` }"
        >
          <template v-for="(image, index) in section.images" :key="index">
            <img
              :src="image.image"
              class="w-full flex-shrink-0 object-cover h-[40vh]"
              alt="Slide"
            />
          </template>
        </div>

        <!-- Prev / Next buttons -->
        <button
          @click="prev"
          class="absolute cursor-pointer top-1/2 left-4 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow"
        >
          <i class="pi pi-angle-left"></i>
        </button>
        <button
          @click="next"
          class="absolute cursor-pointer top-1/2 right-4 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow"
        >
          <i class="pi pi-angle-right"></i>
        </button>
      </div>
    </div>
  </Preview>
</template>