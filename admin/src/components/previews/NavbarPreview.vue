<script setup>
import { useBuilderStore } from '@/stores/builder';
import { computed, ref } from 'vue';
import Preview from '../Preview.vue';
import NavbarSidebarItem from './NavbarSidebarItem.vue';

const props = defineProps({
    uid: Number
})
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const builder = useBuilderStore()
const section = computed(() => builder.feed.find((s) => s.uid === props.uid))
const showSidebar = ref(false)
</script>

<template>
    <Preview :uid="uid">
        <div v-if="showSidebar" @click="showSidebar = false" class="fixed inset-0 bg-transparent z-11"></div>
        <div :class="`${showSidebar ? 'translate-x-0' : '-translate-x-full'} z-12 bg-white border w-[70%] transition-all fixed inset-0 border-gray-300 rounded-tr rounded-br p-3`">
            <div class="w-full flex flex-col">
                <i class="ms-auto cursor-pointer pi pi-times hover:text-red-500" @click="showSidebar = false"></i>
                <div class="flex flex-row p-3 bg-slate-50">
                    <img src="/logo.png" alt="" class="w-[80%] h-auto">
                </div>
                <div class="text-red-500 font-semibold px-3">Zilmil.com.bd</div>
                <div class="p-3" v-if="section.args?.all_categories">
                    <template v-for="(cat,index) in section.args.all_categories" :key="index">
                        <NavbarSidebarItem @close="showSidebar = false" :category="cat"/>
                    </template>
                </div>
            </div>
        </div>
        <nav class="bg-white sticky top-0 shadow px-3 @lg:px-6 py-3 flex items-center justify-center">
            <div class="flex w-full @lg:w-[80%] justify-between">
                <div class="flex items-center gap-3">
                    <span class="@lg:hidden">
                        <i @click="showSidebar = !showSidebar" class="pi pi-bars cursor-pointer hover:text-red-500"></i>
                    </span>
                    <img :src="section.args.preview || `${BACKEND_URL}${section.args.logo}`" alt="Logo" class="h-8 w-auto" />
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