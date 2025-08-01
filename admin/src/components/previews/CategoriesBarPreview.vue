<script setup>
import { useBuilderStore } from '@/stores/builder';
import { computed, Transition } from 'vue';
import Preview from '../Preview.vue';

const props = defineProps({
    uid: Number
})
const builder = useBuilderStore()
const section = computed(() => builder.feed.find((s) => s.uid === props.uid))
</script>

<template>
    <Preview :uid="uid">
        <div class="hidden @lg:flex justify-center bg-red-500 text-white relative">
            <div class="w-full @lg:w-[80%] flex bg-red-500">
                <!-- All Categories Root -->
                <div class="relative group border-l-[0.5px] last:border-r border-gray-300">
                    <div class="px-2 py-1 cursor-pointer hover:bg-red-600">All Categories</div>

                    <Transition name="fade">
                        <div v-if="section.args.all_categories.length"
                            class="absolute top-full rounded left-0 bg-white text-black shadow-md z-10 flex flex-col min-w-[200px] divide-y divide-gray-300 transition-opacity duration-200 ease-out group-hover:flex opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">

                            <template v-for="cat in section.args.all_categories" :key="cat.uid">
                                <div
                                    class="relative hover:bg-gray-100 group/sub transition-all duration-150 ease-in-out">
                                    <div class="flex w-full px-4 py-2 flex-row items-center justify-between transition-all cursor-pointer hover:bg-red-500 hover:text-white">
                                        {{ cat.name }}
                                        <i class="pi pi-chevron-right text-sm" v-if="cat.children && cat.children.length"></i>
                                    </div>

                                    <!-- Submenu with fade -->
                                    <Transition name="fade">
                                        <div v-if="cat.children && cat.children.length"
                                            class="absolute top-0 left-full bg-white shadow-md hidden group-hover/sub:flex flex-col min-w-[200px] z-20 divide-y divide-gray-300 transition-opacity duration-200 ease-out opacity-0 group-hover/sub:opacity-100 pointer-events-none group-hover/sub:pointer-events-auto">
                                            <div v-for="sub in cat.children" :key="sub.id"
                                                class="px-4 py-2 hover:bg-red-500 hover:text-white cursor-pointer transition-colors duration-150">
                                                {{ sub.name }}
                                            </div>
                                        </div>
                                    </Transition>
                                </div>
                            </template>
                        </div>
                    </Transition>
                </div>

                <!-- Direct Categories -->
                <template v-for="cat in section.categories" :key="cat.uid">
                    <div
                        class="px-2 cursor-pointer py-1 border-l-[0.5px] last:border-r border-gray-300 hover:bg-red-600 transition-all">
                        {{ cat.name }}
                    </div>
                </template>
            </div>
        </div>
    </Preview>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>