<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/lib/api'
import ProductCard from '@/components/product/ProductCard.vue'
import Loading from '@/components/ui/Loading.vue'
import BackButton from '@/components/ui/BackButton.vue'

const route = useRoute()
const category = ref(null)
const products = ref([])
const loading = ref(true)

onMounted(async () => {
    window.scrollTo({top:0})
    try {
        const slug = route.params.slug
        const { data: catData } = await api.get(`/categories/${slug}`)
        category.value = catData

        const { data: prodData } = await api.get(`/categories/${slug}/products`)
        products.value = prodData
    } catch (error) {
        console.error('Error fetching category or products:', error)
    } finally {
        loading.value = false
    }
})
</script>

<template>
    <div class="max-w-6xl mx-auto p-2 lg:px-4 lg:py-6">
        <Loading v-if="loading" />
        <div v-else>
            <div class="flex items-center gap-2 mb-6">
                <BackButton />
                <h1 class="text-2xl font-bold">{{ category?.name }}</h1>
            </div>

            <div v-if="products.length === 0" class="text-gray-500">No products found in this category.</div>

            <div class="flex flex-row flex-wrap">
                <template v-for="product in products" :key="product.id">
                    <ProductCard :product="product" />
                </template>
            </div>
        </div>
    </div>
</template>