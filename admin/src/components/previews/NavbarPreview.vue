<script setup>
import { useBuilderStore } from '@/stores/builder';
import { computed } from 'vue';
import Preview from '../Preview.vue';

const props = defineProps({
    uid: Number
})
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const builder = useBuilderStore()
const section = computed(() => builder.feed.find((s) => s.uid === props.uid))
</script>

<template>
    <Preview :uid="uid">
        <nav class="bg-white sticky top-0 shadow px-6 py-3 flex items-center justify-center">
            <div class="flex w-full @lg:w-[80%] justify-between">
                <div class="flex items-center gap-3">
                    <!-- {{ section.args.preview || `http://localhost:8000${section.args.logo}` }} -->
                    <img :src="section.args.preview || `${BACKEND_URL}${section.args.logo}`" alt="Logo" class="h-8 w-auto" />
                    <span class="text-xl font-semibold text-gray-800"></span>
                </div>
                <ul class="flex gap-6 text-gray-700 font-medium">
                    <a href="#" class="hover:text-blue-600">
                        <i class="pi pi-shopping-cart text-2xl"></i>
                    </a>
                </ul>
            </div>
        </nav>
    </Preview>
</template>