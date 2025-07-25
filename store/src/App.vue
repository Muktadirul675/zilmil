<script setup>
import 'primeicons/primeicons.css'
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/lib/api' // assuming your axios instance is here
import { useFeedStore } from '@/stores/feed'
import { useCartStore } from '@/stores/cart'
import Notices from './components/sections/Notices.vue'
import Navbar from './components/sections/Navbar.vue'
import CategoriesBar from './components/sections/CategoriesBar.vue'
import Footer from './components/sections/Footer.vue'

const route = useRoute()
const feed = useFeedStore()
const cart = useCartStore()

// ð¢ Fetch feed and cart
onMounted(() => {
  feed.fetchFeed()
  cart.fetchCart()
})

// ð¢ Send heartbeat to `/active` every 170 sec
onMounted(() => {
  setInterval(() => {
    api.get('/visits/active')
  }, 170000)
})

// ð¢ Watch route change and send visit report (except /cart, /checkout)
watch(
  () => route.path,
  (newPath) => {
    if (!['/cart', '/checkout'].includes(newPath)) {
      api.post('/visits/', { path: newPath })
    }
  },
  { immediate: true }
)

const noticeSection = computed(() =>
  feed.feed.find((section) => section.type === 'notice')
)

const navbarSection = computed(() =>
  feed.feed.find((section) => section.type === 'navbar')
)

const footerSection = computed(() =>
  feed.feed.find((section) => section.type === 'footer')
)

const categoriesBarSection = computed(() =>
  feed.feed.find((section) => section.type === 'categories_bar')
)
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <div class="flex-1">
      <template v-if="noticeSection">
        <Notices :id="noticeSection.id" />
      </template>
      <template v-if="navbarSection">
        <Navbar :id="navbarSection.id" />
      </template>
      <template v-if="categoriesBarSection">
        <CategoriesBar :id="categoriesBarSection.id" />
      </template>
      <RouterView />
    </div>
    <template v-if="footerSection">
      <Footer :id="footerSection.id" />
    </template>
  </div>
</template>
