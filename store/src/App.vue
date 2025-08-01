<script setup>
import api from '@/lib/api'; // assuming your axios instance is here
import { useCartStore } from '@/stores/cart';
import { useFeedStore } from '@/stores/feed';
import 'primeicons/primeicons.css';
import { computed, KeepAlive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import CategoriesBar from './components/sections/CategoriesBar.vue';
import Footer from './components/sections/Footer.vue';
import Navbar from './components/sections/Navbar.vue';
import Notices from './components/sections/Notices.vue';
import { useSettingsStore } from './stores/settings';
import Toaster from './components/composables/Toaster.vue';

const feed = useFeedStore()
const cart = useCartStore()
const settings = useSettingsStore()
// ð¢ Fetch feed and cart

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

const router = useRouter()

async function visit(path) {
  try {
    console.log('visiting')
    await api.post('/visits/', { path: path })
    console.log('visited')
  } catch (e) {
    console.log(`Visiting ERROR: ${e.message}`)
  }
}

router.afterEach((to) => {
  if (!['/cart', '/checkout'].includes(to.path)) {
    visit(to.path)
  }
})

onMounted(async () => {
  await Promise.all([
    feed.fetchFeed(),
    cart.fetchCart(),
    settings.fetchSettings(),
    await api.get('/visits/active')
  ])
  setInterval(() => {
    api.get('/visits/active')
  }, 170000)
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <Toaster/>
    <div class="flex-1">
      <template v-if="noticeSection">
        <Notices :section="noticeSection" />
      </template>
      <template v-if="navbarSection">
        <Navbar :section="navbarSection" />
      </template>
      <template v-if="categoriesBarSection">
        <CategoriesBar :section="categoriesBarSection" />
      </template>

      <RouterView v-slot="{ Component }">
        <KeepAlive include="HomeView">
          <component :is="Component" />
        </KeepAlive>
      </RouterView>
    </div>

    <template v-if="footerSection">
      <Suspense>
        <template #default>
          <Footer :section="footerSection" />
        </template>
      </Suspense>
    </template>
  </div>
</template>