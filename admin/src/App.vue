<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth';
import { onBeforeMount, onMounted } from 'vue';
import { useProductStore } from './stores/products';
import { useOrderStore } from './stores/orders';
import { useBuilderStore } from './stores/builder';
import 'vue3-toastify/dist/index.css';
import { useActivityStore } from './stores/activities';
import { useVisitsAnalyticsStore } from './stores/analytics/visits';

const auth = useAuthStore()
const products = useProductStore()
const orders = useOrderStore()
const builder = useBuilderStore()
const activity = useActivityStore()
const visits = useVisitsAnalyticsStore()

onBeforeMount(() => {
  auth.fetchUser()
})

onMounted(() => {
  products.initProductSocket()
  orders.initOrderSocket()
  builder.init()
  activity.fetchActivities()
  activity.connectWebSocket()
  visits.fetchAll()

  setInterval(()=>{
    visits.fetchAll()
  },1000*60*2)
})

</script>

<template>
  <RouterView />
</template>
