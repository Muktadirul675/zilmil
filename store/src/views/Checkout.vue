<template>
  <!-- Loading state -->
  <div class="max-w-xl mx-auto p-2 lg:p-3">
    <div v-if="success" id="success"
      class="min-h-[200px] flex gap-2 flex-col w-full bg-white rounded justify-center items-center">
      <img src="/order_confirmed.gif" class="w-[70px] h-[70px]" alt="">
      <div class="text-3xl text-green-500">Order Confirmed!</div>
      <div class="text-lg text-green-500">Your Order id #{{ order_id }}</div>
      <RouterLink to="/" class="btn"> <i class="pi pi-shopping-cart me-2"></i> Continue Shopping</RouterLink>
    </div>
    <div v-else-if="loading"
      class="min-h-[200px] flex gap-2 flex-col w-full bg-white rounded justify-center items-center">
      <img class="h-[70px] w-[70px]" src="/delivery_processing.gif" alt="">
      <div class="text-lg">Confirming your order</div>
    </div>
    <div class="max-w-xl mx-auto text-center py-12 text-gray-500" v-else-if="cart.loading">
      <i class="pi pi-spin pi-spinner text-4xl mb-4"></i>
      <p class="text-lg font-medium">Loading your cart...</p>
    </div>

    <!-- Empty cart state -->
    <div v-else-if="cart.cart && cart.cart.items.length === 0" class="max-w-xl mx-auto text-center py-12 text-gray-400">
      <i class="pi pi-shopping-cart text-5xl mb-4"></i>
      <p class="text-lg font-semibold">Your cart is empty</p>
      <p class="text-sm">Add some items to get started.</p>
      <RouterLink to="/" class="btn"> <i class="pi pi-shopping-cart me-2 my-4"></i> Shop Now</RouterLink>
    </div>
    <div v-else class="border border-gray-300 rounded m-2">
      <h1 class="text-2xl font-bold mb-4 p-3 bg-blue-100 text-slate-800 uppercase">
        <i class="pi pi-wallet me-2"></i>
        Checkout
      </h1>
      <div class="space-y-2 p-3">
        <label class="block text-sm font-medium text-gray-700">
          <i class="pi pi-user mr-2"></i>Full Name
        </label>
        <input v-model="name" type="text" placeholder="Full Name" class="w-full p-2 border border-gray-300 rounded" />

        <!-- Shipping Address -->
        <label class="block text-sm font-medium text-gray-700">
          <i class="pi pi-map-marker mr-2"></i>Shipping Address
        </label>
        <textarea v-model="address" placeholder="Shipping Address"
          class="w-full p-2 border border-gray-300 rounded"></textarea>

        <!-- Phone Number -->
        <label class="block text-sm font-medium text-gray-700">
          <i class="pi pi-phone mr-2"></i>Phone Number
        </label>
        <input v-model="phone" type="text" placeholder="Phone Number"
          class="w-full p-2 border border-gray-300 rounded" />

        <div class="flex my-2 items-center gap-4">
          <label>
            <input type="radio" v-model="location" value="inside" />
            Inside Dhaka
          </label>
          <label>
            <input type="radio" v-model="location" value="outside" />
            Outside Dhaka
          </label>
        </div>
        <div class="w-full bg-gray-300 h-[1px] my-3"></div>
        <div class="text-slade-800 mt-2 uppercase font-semibold">
          <i class="pi pi-shopping-cart me-2"></i> Order Summary
        </div>
        <div class="divide-y divide-gray-300">
          <template v-if="cart.cart && cart.cart.items" v-for="item in cart.cart.items" :key="item.id">
            <div class="flex items-start justify-between p-2">
              <div class="flex items-center gap-2">
                <img :src="`${item.product.image.image}`" alt="" class="w-10 h-10 rounded">
                <span class="font-semibold">{{ item.product.name }}</span>
              </div>
              <div class="text-sm flex items-end flex-col">
                <div>{{ formatBDT(item.product.net_price || item.product.price)}} <i class="pi pi-times text-xs"></i> {{
                  item.quantity }} </div>
                <div class="text-red-500">
                  <BDT :amount="(item.product.net_price || item.product.price) * item.quantity" />
                </div>
              </div>
            </div>
          </template>
        </div>
        <div class="">
          <p class="flex items-center">Subtotal:
            <BDT :amount="parseFloat(subtotal)" />
          </p>
          <p class="flex items-center">Delivery:
            <BDT :amount="parseFloat(deliveryCharge)" />
          </p>
          <p class="font-bold text-lg flex items-center">Total:
            <span class="text-red-500">
              <BDT :amount="parseFloat(total)" />
            </span>
          </p>
        </div>

        <button :disabled="!isFormValid || loading" @click="submitOrder"
          class="w-full bg-red-500 hover:bg-red-600 cursor-pointer transition-all text-white p-2 rounded disabled:opacity-50">
          <span v-if="loading">Placing Order...</span>
          <span v-else-if="!isFormValid">Please fill all informations to confirm order</span>
          <span v-else class=""> <i class="pi pi-check me-2"></i> Confirm Order</span>
        </button>

        <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import api from '@/lib/api'
import BDT from '@/components/ui/BDT.vue'
import { RouterLink } from 'vue-router'
import { useToast } from '@/lib/toast'
import { useSettingsStore } from '@/stores/settings'
import { useHead } from '@vueuse/head'
import { formatBDT } from '@/lib/utils'

useHead({
  title: "Checkout - Zilmil.com.bd"
})

const cart = useCartStore()
const settings = useSettingsStore()
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const name = ref('')
const address = ref('')
const phone = ref('')
const location = ref('inside')

const loading = ref(false)
const error = ref(null)
const success = ref(false)
const order_id = ref(null)

const subtotal = computed(() => cart?.cart?.total_price || 0)
const deliveryCharge = computed(() => location.value === 'inside' ? parseFloat(
  settings.get('delivery_charge_inside_dhaka')
) : parseFloat(
  settings.get('delivery_charge_outside_dhaka')
))
const total = computed(() => parseFloat(subtotal.value) + parseFloat(deliveryCharge.value))

const toast = useToast()

const isFormValid = computed(() =>
  name.value && address.value && phone.value && location.value
)

const submitOrder = async () => {
  if (!isFormValid.value) return

  loading.value = true
  error.value = null
  success.value = false

  try {
    const res = await api.post('/cart/checkout/', {
      full_name: name.value,
      shipping_address: address.value,
      phone: phone.value,
    })
    success.value = true
    order_id.value = res.data.order_id
    cart.fetchCart()
    window.scrollTo({ behavior: 'smooth', top: 0 })
    // Optional: Clear the form or cart here
  } catch (err) {
    error.value = 'Failed to place order. Please try again.'
    toast.error('Failed to place order. Please try again.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  window.scrollTo({ top: 0 })
})
</script>