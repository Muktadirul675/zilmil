<script setup>
import { useBuilderStore } from '@/stores/builder';
import { computed } from 'vue';
import Preview from '../Preview.vue';

const props = defineProps({
    uid:Number
})
const builder = useBuilderStore()
const section = computed(()=>builder.feed.find((s)=>s.uid === props.uid))
</script>

<template>
    <Preview :uid="uid">
        <!-- {{ section.categories }} -->
        <div class="hidden @lg:flex justify-center bg-red-500 text-white">
            <div class="w-full @lg:w-[80%] flex bg-red-500">
                <div class="px-2 cursor-pointer py-1 border-l-[0.5px] last:border-r border-gray-300 hover:bg-red-600 transition-all">All Categories</div>
                <template v-for="cat in section.categories" :key="cat.uid">
                    <div class="px-2 cursor-pointer py-1 border-l-[0.5px] last:border-r border-gray-300 hover:bg-red-600 transition-all">{{ cat.name }}</div>
                </template>
            </div>
        </div>
    </Preview>
</template>
