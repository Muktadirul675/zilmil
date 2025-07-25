<script setup>
import { computed } from 'vue';
import BDT from '../ui/BDT.vue';

const { product: prod } = defineProps({
    product: Object
})
const product = computed(() => {
    let p = prod
    if (!(String(p.image.image).startsWith(import.meta.env.VITE_BACKEND_URL))) {
        p.image.image = import.meta.env.VITE_BACKEND_URL + p.image.image
    }
    return p;
})
</script>

<template>
    <div class="w-1/2 lg:w-1/4 p-1 hover:shadow transition-all cursor-pointer">
        <RouterLink class="relative block group" :to="`/${product.slug}`">
            <img :src="product.image.image" class="aspect-auto w-full" alt="">
            <div
                :class="`absolute overflow-hidden h-0 group-hover:h-[32px] transition-all flex bg-white justify-center bottom-0 w-full`">
                <div class="flex flex-row items-center gap-2">
                    <i class="pi pi-shopping-cart text-xl cursor-pointer hover:text-red-500 p-1 rounded"></i>
                    <i class="pi pi-eye text-xl cursor-pointer hover:text-red-500 p-1 rounded"></i>
                </div>
            </div>
        </RouterLink>
        <div class="w-full">
            <div class="text-lg font-semibold my-2 truncate w-full">
                {{ product.name }}
            </div>
            <div class="text-lg font-semibold my-2 truncate w-full flex flex-col lg:flex-row lg:items-center">
                <span class="text-red-500">
                    <BDT :amount="parseFloat(product.net_price ?? product.price)"/>
                </span>
                <span v-if="product.net_price" class="text-sm line-through text-gray-500 ml-2">
                    {{ product.price }}
                </span>
                <span v-else-if="product.compared_price" class="text-sm line-through text-gray-500 ml-2">
                    {{ product.compared_price }}
                </span>
            </div>
            <button
                class="cursor-pointer text-white rounded px-2 py-1.5 justify-center flex items-center w-full hover:bg-red-600 transition-all bg-red-500">
                <i class="pi pi-shopping-cart"></i>
                <div class="mx-1"></div>
                Add To Cart
            </button>
        </div>
    </div>
</template>