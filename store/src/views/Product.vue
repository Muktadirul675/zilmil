<template>
  <div class="w-full lg:w-[70%] mx-auto">
    <Loading v-if="loading" />
    <div v-else-if="product" class="flex flex-col md:flex-row gap-4">
      <!-- Left: Carousel -->
      <div class="w-full md:w-[70%]">
        <h1 class="text-xl font-semibold my-1 p-2 lg:p-0 lg:my-3">{{ product.name }}</h1>
        <div class="relative overflow-hidden lg:border lg:border-gray-300 lg:rounded-lg">
          <div class="flex transition-transform duration-500 ease-in-out"
            :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
            <img v-for="(img, index) in product.images" :key="img.id" :src="img.image"
              :alt="img.alt_text || `Image ${index + 1}`" class="min-w-full object-cover max-h-[50vh]" />
          </div>

          <!-- Controls -->
          <button class="absolute cursor-pointer left-0 top-1/2 transform -translate-y-1/2 text-white text-2xl px-2"
            @click="prevSlide">
            <i class="pi pi-chevron-left"></i>
          </button>
          <button class="absolute cursor-pointer right-0 top-1/2 transform -translate-y-1/2 text-white text-2xl px-2"
            @click="nextSlide">
            <i class="pi pi-chevron-right"></i>
          </button>
        </div>

        <!-- Thumbnails -->
        <div class="flex justify-center gap-2 mt-2">
          <img v-for="(img, index) in product.images" :key="img.id" :src="img.image"
            class="h-16 w-16 object-cover border-2 cursor-pointer rounded-md" :class="{
              'border-black': currentIndex === index,
              'border-gray-300': currentIndex !== index,
              'opacity-70': currentIndex !== index,
            }" @click="goToSlide(index)" />
        </div>
      </div>

      <!-- Right: Selections -->
      <div class="w-full md:w-[30%] flex flex-col gap-2 lg:gap-4">
        <div class="flex items-center space-x-2 text-lg mt-2 lg:mt-12 px-2 lg:px-0">
          <span v-if="product.net_price" class="text-red-500 font-semibold text-2xl">
            <BDT :amount="parseFloat(product.net_price)" />
          </span>
          <span class="line-through text-gray-500" v-if="product.net_price">
            {{ product.price }}
          </span>

          <span v-else class="text-red-500 font-semibold text-2xl">
            <BDT :amount="parseFloat(product.price)" />
          </span>
          <span v-if="!product.net_price" class="line-through text-gray-500">
            {{ product.compared_price }}
          </span>
        </div>

        <!-- Variants -->
        <div v-if="product.variants?.length" class="flex p-2 lg:p-0 flex-wrap gap-2">
          <div v-for="variant in product.variants" :key="variant.id"
            class="px-3 py-1 text-white transition-all rounded cursor-pointer bg-red-500 hover:bg-red-600"
            :class="{ 'ring-2 ring-black': selectedVariant === variant.id }" @click="selectedVariant = variant.id">
            <i class="pi pi-check me-2" v-if="selectedVariant === variant.id"></i>
            {{ variant.name }}
          </div>
        </div>

        <!-- Colors -->
        <div v-if="product.colors?.length" class="flex p-2 lg:p-0 flex-wrap gap-4">
          <div v-for="color in product.colors" :key="color.id"
            class="flex flex-col items-center cursor-pointer hover:scale-105 transition"
            @click="selectedColor = color.id">
            <div class="w-10 h-10 rounded-full border-2"
              :class="selectedColor === color.id ? 'ring-2 ring-black' : 'border-gray-300'"
              :style="{ backgroundColor: color.hex_code }" />
            <span class="text-sm mt-1">{{ color.name }}</span>
          </div>
        </div>

        <!-- Quantity + Add to Cart -->
        <div class="flex gap-2 w-full p-2 lg:p-0">
          <div class="flex border border-gray-300 rounded-md w-full overflow-hidden">
            <button :disabled="quantity === 1" class="px-3 py-1 text-2xl cursor-pointer"
              @click="quantity = Math.max(1, quantity - 1)">-</button>
            <input disabled type="number" class="w-full text-center outline-none appearance-none"
              v-model.number="quantity" min="1" />
            <button :disabled="quantity === product.stock" class="px-3 py-1 text-2xl cursor-pointer"
              @click="quantity = Math.min(quantity + 1, maxStock)">+</button>
          </div>
          <button
            class="bg-red-500 cursor-pointer hover:bg-red-600 text-white px-4 py-2 rounded-md w-full flex justify-center items-center gap-2"
            :disabled="addingToCart" @click="handleAddToCart">
            <i class="pi pi-spin pi-spinner" v-if="addingToCart"></i>
            <template v-else>
              <i class="pi pi-shopping-cart me-2"></i>Add to Cart
            </template>
          </button>
        </div>
        <p v-if="errorMessage" class="text-sm text-red-500 px-2">{{ errorMessage }}</p>
        <!-- Categories -->
        <div class="my-2 px-2 lg:px-0">
          Categories:
          <template v-for="(cat, index) in product.categories" :key="cat.id">
            <span class="text-red-500 hover:text-red-700 cursor-pointer">
              {{ cat.name }}
            </span>
            <span v-if="index !== product.categories.length - 1" class="text-gray-500">,</span>
          </template>
        </div>

        <!-- Contact Options -->
        <div class="flex gap-1 flex-col p-1 lg:p-0">
          <div
            class="text-white rounded bg-red-500 hover:bg-red-600 transition-all flex items-center gap-2 px-2 py-1.5 cursor-pointer justify-center">
            <Phone class="w-4 h-4" /> Call us at +8801712345678
          </div>
          <div
            class="text-white rounded bg-red-500 hover:bg-red-600 transition-all flex items-center gap-2 px-2 py-1.5 cursor-pointer justify-center">
            <MessageSquare class="w-4 h-4" /> Contact at WhatsApp
          </div>
          <div
            class="text-white rounded bg-red-500 hover:bg-red-600 transition-all flex items-center gap-2 px-2 py-1.5 cursor-pointer justify-center">
            <FacebookIcon class="w-4 h-4" /> Contact at Messenger
          </div>
        </div>
      </div>
    </div>

    <!-- Description -->
    <div v-if="product && !loading" class="lg:mt-6 p-3 rounded-md">
      <div class="text-lg font-semibold mb-2">Description</div>
      <p v-html="product.description" class="text-gray-700 whitespace-pre-line"></p>
    </div>
    <!-- Similar Products -->
    <div v-if="similars.length && !loading" class="mt-10">
      <h2 class="text-xl font-semibold mb-4">You may also like</h2>
      <div class="flex flex-row flex-wrap">
        <ProductCard v-for="product in similars" :key="product.id" :product="product" />
      </div>
    </div>
    <!-- Error -->
    <div v-else class="text-center text-red-500 p-5">{{ error }}</div>
  </div>
</template>

<script setup>
import { Phone, MessageSquare, FacebookIcon } from 'lucide-vue-next'
import { ref, onMounted, watch, computed } from 'vue'
import api from '@/lib/api'
import Loading from '@/components/ui/Loading.vue'
import { useRoute } from 'vue-router'
import BDT from '@/components/ui/BDT.vue'
import { useCartStore } from '@/stores/cart'
import ProductCard from '@/components/product/ProductCard.vue'

const route = useRoute()
const cart = useCartStore()

const product = ref(null)
const error = ref('')
const loading = ref(true)
const currentIndex = ref(0)
const selectedVariant = ref(null)
const selectedColor = ref(null)
const quantity = ref(1)
const addingToCart = ref(false)
const similars = ref([])

const maxStock = computed(() => {
  if (product.value) {
    let variant = null;
    let color = null;
    if (product.value.variants && selectedVariant.value) {
      variant = product.value.variants.find((v) => v.id === selectedVariant.value)
    }
    if (product.value.colors && selectedColor.value) {
      color = product.value.colors.find((v) => v.id === selectedColor.value)
    }
    return Math.min(product.value.stock, variant.stock, color.stock)
  }
  return 0
})

async function fetchSimilars(id){
    // Fetch suggestions based on the product ID
    const suggestionsRes = await api.get(`/products/${id}/suggestions`)
    similars.value = suggestionsRes.data
}

const fetchProduct = async () => {
  try {
    loading.value = true
    const { data } = await api.get(`/products/${route.params.slug}/`)
    product.value = data
    fetchSimilars()
  } catch (e) {
    error.value = 'Failed to load product'
  } finally {
    loading.value = false
  }
}

const errorMessage = ref('')

const handleAddToCart = async () => {
  errorMessage.value = ''

  if (!product.value?.id || quantity.value < 1) return

  // Validate color selection if variants exist
  if (product.value.variants?.length && !selectedVariant.value) {
    errorMessage.value += `${errorMessage.value === "" ? '' : '\n'}` + 'Please select a variant.'
    return
  }

  // Validate color selection if colors exist
  if (product.value.colors?.length && !selectedColor.value) {
    errorMessage.value += `${errorMessage.value === "" ? '' : '\n'}` + 'Please select a color.'
    return
  }

  const payload = {
    product: product.value.id,
    quantity: quantity.value,
  }
  if (selectedVariant.value) payload.variant = selectedVariant.value
  if (selectedColor.value) payload.color = selectedColor.value

  addingToCart.value = true
  try {
    await cart.addToCart(payload)
  } catch (e) {
    alert('Failed to add to cart')
  } finally {
    addingToCart.value = false
  }
}

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % product.value.images.length
}
const prevSlide = () => {
  currentIndex.value =
    currentIndex.value === 0 ? product.value.images.length - 1 : currentIndex.value - 1
}
const goToSlide = (index) => {
  currentIndex.value = index
}

let isRollingBack = false;

watch(quantity, (newVal) => {
  if (isRollingBack) {
    isRollingBack = true;
    return;
  }
  if (newVal > maxStock) {
    isRollingBack = true;
    quantity.value = maxStock
  }
  if (newVal == 0) {
    isRollingBack = true;
    quantity.value = 1
  }
})

watch(() => route.params.slug, () => {
  fetchProduct()
  window.scrollTo({top:0})
})

setInterval(nextSlide, 5000)
onMounted(() => {
  fetchProduct()
  window.scrollTo({ top: 0 })
})
</script>

<style scoped>
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>