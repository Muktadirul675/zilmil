<script setup>
import { useBuilderStore } from '@/stores/builder';
import { computed, effect, onMounted, ref } from 'vue';
import Builder from '../Builder.vue';
import api from '@/services/api';

const props = defineProps({
    uid: Number
})
const builder = useBuilderStore()
const section = computed(()=>builder.feed.find((s)=>s.uid === props.uid))
const categories = ref([])
const selecteds = computed(()=>section.value.categories.map((c)=>c.id))
const isLoading = ref(false)
const error = ref('')
let uid = 2000; 

onMounted(async ()=>{
    try{
        isLoading.value = true
        const res = await api.get("/categories")
        categories.value = res.data.map((c)=>({...c, uid:uid++}))
    }catch(e){
        error.value = e
    }finally{
        isLoading.value = false;
    }
})
const add = (id) =>{
    const cat = categories.value.find((c)=>c.id === id)
    section.value.categories.push(cat)
}

const remove = (id) =>{
    section.value.categories = section.value.categories.filter((c)=>c.id !== id)
}

const clck = (id) =>{
    if(selecteds.value.includes(id)) remove(id)
    else add(id)
}

</script>

<template>
    <Builder :uid="props.uid">
        <h3 class="text-lg font-bold text-gray-800 my-2">
            Select Categories
        </h3>
        <div v-if="isLoading">
            <i class="pi pi-cog pi-spin text-xl my-2"></i>
        </div>
        <div v-else class="flex flex-col divide-y max-h-[100px] overflow-auto rounded border border-gray-300 divide-gray-300">
            <template v-for="cat in categories" :key="cat.uid">
                <div @click="clck(cat.id,cat.uid)" :class="`p-2 cursor-pointer ${selecteds.includes(cat.id) ? 'bg-blue-500 text-white' : ''}`">
                    {{ cat.name }}
                </div>
            </template>
        </div>
    </Builder>
</template>