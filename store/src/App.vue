<script setup>
import 'primeicons/primeicons.css'
import { computed, onMounted } from 'vue';
import { useFeedStore } from './stores/feed';
import Notices from './components/sections/Notices.vue';
import Navbar from './components/sections/Navbar.vue';
import CategoriesBar from './components/sections/CategoriesBar.vue';
import { useCartStore } from './stores/cart';
import Footer from './components/sections/Footer.vue';

const feed = useFeedStore()
const cart = useCartStore()

onMounted(() => feed.fetchFeed())

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

onMounted(() => {
  cart.fetchCart()
})
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
