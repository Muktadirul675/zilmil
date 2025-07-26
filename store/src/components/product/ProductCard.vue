<script setup>
import { computed, ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import BDT from '../ui/BDT.vue'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const { product } = toRefs(props)
const router = useRouter()
const cartStore = useCartStore()
const loading = ref(false)

const imageUrl = computed(() => {
  const img = product.value.image?.image || ''
  return img.startsWith('http') ? img : `${BACKEND_URL}${img}`
})

const hasVariants = computed(() =>
  Boolean(product.value.variants?.length || product.value.colors?.length)
)

const netPrice = computed(() =>
  parseFloat(product.value.net_price || product.value.price)
)

const originalPrice = computed(() =>
  product.value.net_price ? product.value.price : product.value.compared_price
)

const handleAddToCart = async () => {
  if (hasVariants.value) {
    router.push(`/${product.value.slug}`)
    return
  }

  loading.value = true
  try {
    await cartStore.addToCart({
      product: product.value.id,
      quantity: 1
    })
  } catch (err) {
    alert('Failed to add to cart.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="w-1/2 md:w-1/3 lg:w-1/4 p-1">
    <div class="bg-white rounded hover:shadow transition overflow-hidden">
      <RouterLink :to="`/${product.slug}`" class="block relative group">
        <img
          :src="imageUrl"
          alt="Product"
          loading="lazy"
          decoding="async"
          class="aspect-[4/3] w-full object-cover transition-transform group-hover:scale-[1.02]"
        />

        <div
          class="absolute bottom-0 w-full h-0 group-hover:h-8 transition-all duration-300 bg-white/80 flex justify-center items-center gap-4 overflow-hidden">
          <i class="pi pi-shopping-cart text-xl cursor-pointer hover:text-red-500"></i>
          <i class="pi pi-eye text-xl cursor-pointer hover:text-red-500"></i>
        </div>
      </RouterLink>

      <div class="p-2">
        <div class="text-sm font-medium truncate mb-1">
          {{ product.name }}
        </div>

        <div class="text-red-500 font-semibold text-lg flex flex-col lg:flex-row lg:items-center gap-2">
          <BDT :amount="netPrice" />
          <span v-if="originalPrice" class="text-sm text-gray-500 line-through">
            {{ originalPrice }}
          </span>
        </div>

        <button
          @click="handleAddToCart"
          :disabled="loading"
          class="w-full mt-2 flex items-center justify-center text-sm font-medium rounded px-3 py-2 transition-all text-white"
          :class="loading ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'">
          <i :class="loading ? 'pi pi-spinner pi-spin' : 'pi pi-shopping-cart'" />
          <span class="ml-2">{{ loading ? 'Adding...' : 'Add To Cart' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>