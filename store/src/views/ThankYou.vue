<template>
    <div v-if="loading"
      class="min-h-[200px] flex gap-2 flex-col w-full bg-white rounded justify-center items-center">
      <img class="h-[70px] w-[70px]" src="/delivery_processing.gif" alt="">
      <div class="text-lg">Processing</div>
    </div>
    <template v-else>
        <div v-if="success" id="success"
            class="min-h-[50vh] flex gap-2 flex-col w-full bg-white rounded justify-center items-center">
            <img src="/order_confirmed.gif" class="w-[70px] h-[70px]" alt="">
            <div class="text-3xl text-red-500 text-center">ধন্যবাদ!</div>
            <div class="text-xl text-green-500 text-center">আপনার অর্ডার গ্রহণ করা হয়েছে</div>
            <div class="text-green-500 text-center">কিছুক্ষণের মধ্যে আমাদের একজন প্রতিনিধি আপনার সাথে যোগাযোগ করে অর্ডারটি কনফার্ম করবে।</div>
            <div class="text-lg text-green-500 text-center"> Order id: Z-#{{ order_id }}</div>
            <RouterLink to="/" class="btn"> <i class="pi pi-shopping-cart me-2"></i> Continue Shopping</RouterLink>
        </div>
        <div v-else>
            <h3 class="text-lg text-red-500 p-3">Error!</h3>
        </div>
    </template>
</template>
<script setup>
import api from '@/lib/api'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'


const route = useRoute()
const router = useRouter()

const order_id = ref(null)
const success = ref(false)
const loading = ref(true)

onMounted(async () => {
  const id = route.query.order_id

  if (!id) {
    router.push('/not-found')
    return
  }

  window.scrollTo({behavior:'smooth',top:0})

  order_id.value = id
  loading.value = true

  try {
    const res = await api.get(`/orders/verify?order_id=${id}`)

    if (res.data?.valid) {
      success.value = true
    } else {
      router.push('/not-found')
    }
  } catch (err) {
    console.error('Order verification failed:', err)
    router.push('/not-found')
  } finally {
    loading.value = false
  }
})
</script>
