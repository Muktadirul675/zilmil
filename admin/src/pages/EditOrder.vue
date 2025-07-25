<template>
  <div class="max-w-[90%] mx-auto mt-10">
    <div class="bg-white p-6 rounded shadow-md">
      <div class="mb-6 flex items-center justify-start gap-2">
        <BackButton/>
        <h2 class="text-2xl font-semibold">Edit Order</h2>
      </div>

      <form @submit.prevent="submitOrder">
        <div class="grid grid-cols-1 md:grid-cols-5 gap-6">
          <!-- Left (Compact Inputs) -->
          <div class="md:col-span-2 space-y-4">
            <FormInput label="Full Name" icon="user" v-model="order.full_name" required />
            <FormInput label="Phone" icon="phone" v-model="order.phone" required />

            <div>
              <FormLabel icon="home">Shipping Address</FormLabel>
              <textarea v-model="order.shipping_address" required placeholder="Shipping Address"
                class="w-full border border-gray-300 bg-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
            </div>

            <FormInput label="Discount" icon="percentage" v-model="order.order_discount" type="number" />

            <div>
              <FormInput label="Delivery Charge" icon="dollar" v-model="order.delivery_charge" type="number" />
              <p v-if="isCalculatingDelivery" class="text-xs text-gray-500 mt-1">Calculating delivery charge...</p>
            </div>

            <div>
              <FormLabel icon="tag">Status</FormLabel>
              <select v-model="order.status"
                class="w-full border border-gray-300 bg-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                <option v-for="s in statusOptions" :key="s" :value="s">{{ capitalize(s) }}</option>
              </select>
            </div>

            <div>
              <FormLabel icon="info-circle">Note</FormLabel>
              <textarea v-model="order.note" placeholder="Note"
                class="w-full border border-gray-300 bg-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
            </div>

            <!-- Location Selects -->
            <SearchSelect label="City" icon="map-marker" :items="cities" itemKey="city_id" itemLabel="city_name"
              v-model="order.city_id" @change="fetchZones" />
            <SearchSelect label="Zone" icon="globe" :items="zones" itemKey="zone_id" itemLabel="zone_name"
              v-model="order.zone_id" @change="fetchAreas" :disabled="!order.city_id" />
            <SearchSelect label="Area" icon="location-arrow" :items="areas" itemKey="area_id" itemLabel="area_name"
              v-model="order.area_id" :disabled="!order.zone_id" />

            <!-- Total Price -->
            <div class="text-sm font-medium pt-2 flex items-center">
              Total Price:
              <BDT :amount="totalPrice" />
            </div>
          </div>

          <!-- Right (Wider Product Section) -->
          <div class="md:col-span-3 space-y-4">
            <FraudChecker v-if="order.phone" :number="order.phone" />
            <OrderItemPreview :items="order.items" @remove="i => order.items.splice(i, 1)" />
            <ProductSelector @add="item => order.items.push(item)" />
          </div>
        </div>

        <!-- Submit -->
        <div class="mt-6">
          <button type="submit"
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded transition cursor-pointer">
            <i class="pi pi-check mr-1" /> Update Order
          </button>
          <p v-if="error" class="text-red-600 text-sm mt-2">{{ error }}</p>
          <p v-if="success" class="text-green-600 text-sm mt-2">Order updated successfully!</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import ProductSelector from '@/components/ProductSelector.vue'
import OrderItemPreview from '@/components/OrderItemPreview.vue'
import FormInput from '@/components/ui/FormInput.vue'
import FormLabel from '@/components/ui/FormLabel.vue'
import SearchSelect from '@/components/ui/SearchSelect.vue'
import FraudChecker from '@/components/FraudChecker.vue'
import BDT from '@/components/ui/BDT.vue'
import BackButton from '@/components/ui/BackButton.vue'

const router = useRouter()
const route = useRoute()
const orderId = route.params.id

const order = ref({
  full_name: '',
  phone: '',
  shipping_address: '',
  order_discount: 0,
  delivery_charge: 0,
  status: 'pending',
  note: '',
  city_id: null,
  zone_id: null,
  area_id: null,
  items: [],
})

const statusOptions = ['pending', 'confirmed', 'hold', 'shipped', 'delivered', 'cancelled', 'returned']
const success = ref(false)
const error = ref('')
const loading = ref(false)
const isCalculatingDelivery = ref(false)

const cities = ref([])
const zones = ref([])
const areas = ref([])

const fetchCities = async () => {
  const res = await api.get('/courier/cities/')
  cities.value = res.data?.data || []
}

const fetchZones = async () => {
  order.value.zone_id = null
  order.value.area_id = null
  if (!order.value.city_id) return
  const res = await api.get(`/courier/zones/?city_id=${order.value.city_id}`)
  zones.value = res.data?.data || []
}

const fetchAreas = async () => {
  order.value.area_id = null
  if (!order.value.zone_id) return
  const res = await api.get(`/courier/areas/?zone_id=${order.value.zone_id}`)
  areas.value = res.data?.data || []
}

const fetchOrder = async () => {
  try {
    const res = await api.get(`/orders/${orderId}/`)
    const data = res.data
    order.value = {
      full_name: data.full_name,
      phone: data.phone,
      shipping_address: data.shipping_address,
      order_discount: data.order_discount,
      delivery_charge: data.delivery_charge,
      status: data.status,
      note: data.note,
      city_id: data.city_id,
      zone_id: data.zone_id,
      area_id: data.area_id,
      items: data.items || [],
    }

    await fetchZones()
    await fetchAreas()
  } catch (err) {
    error.value = 'Failed to load order data.'
    console.error(err)
  }
}

watch(
  () => [order.value.city_id, order.value.zone_id],
  async ([cityId, zoneId]) => {
    if (cityId && zoneId) {
      isCalculatingDelivery.value = true
      try {
        const res = await api.get('/courier/delivery-charge/', {
          params: {
            city_id: cityId,
            zone_id: zoneId,
          },
        })
        order.value.delivery_charge = res.data?.price || 0
      } catch (err) {
        console.error('Failed to fetch delivery charge:', err)
      } finally {
        isCalculatingDelivery.value = false
      }
    }
  }
)

const totalPrice = computed(() => {
  const itemsTotal = order.value.items?.reduce((acc, item) => {
    return acc + (item.price_at_purchase * item.quantity || 0)
  }, 0) || 0

  const discount = Number(order.value.order_discount || 0)
  const delivery = Number(order.value.delivery_charge || 0)

  return itemsTotal - discount + delivery
})

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const submitOrder = async () => {
  loading.value = true
  error.value = ''
  success.value = false

  if (!order.value.full_name || !order.value.phone || !order.value.shipping_address || !order.value.status) {
    error.value = 'Name, phone, address, and status are required.'
    loading.value = false
    return
  }

  try {
    const payload = {
      ...order.value,
      items: order.value.items.map(item => ({
        product_id: item.product_id || item.product?.id,
        variant_id: item.variant_id || item.variant?.id || null,
        color_id: item.color_id || item.color?.id || null,
        quantity: item.quantity,
        price_at_purchase: item.price_at_purchase,
      })),
    }

    await api.patch(`/orders/${orderId}/`, payload)
    success.value = true
    router.push('/orders')
  } catch (err) {
    error.value = err.message || 'Failed to update order.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCities()
  fetchOrder()
})
</script>