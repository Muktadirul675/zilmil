<script setup>
import { computed } from 'vue';
import Preview from '../Preview.vue';
import { useBuilderStore } from '@/stores/builder';
import ProductCard from './product/ProductCard.vue';

const props = defineProps({
    uid: Number
})
const builder = useBuilderStore()
const section = computed(()=>builder.feed.find((s)=>s.uid === props.uid))
</script>

<template>
    <Preview :uid="props.uid">
        <div class="flex w-full my-2 justify-center">
            <div class="w-full @lg:w-4/5">
                <div class="p-2">
                    <div class="flex flex-row flex-wrap justify-between">
                        <h3 class="font-semibold text-xl">{{ section.title }}</h3>
                        <button class="text-white rounded cursor-pointer px-2 py-1 bg-red-500 hover:bg-red-600 transition-all">See All</button>
                    </div>
                    <div class="flex flex-start flex-row flex-wrap justify-start">
                        <template v-for="product in section.products" :key="product.uid">
                            <ProductCard :product="product"/>
                             <!-- {{ product }} -->
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </Preview>
</template>
