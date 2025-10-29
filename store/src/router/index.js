import HomeView from '@/views/HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import api from '@/lib/api'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'HomeView',
      component: HomeView,
      meta: { keepAlive: true },
    },
    {
      path: '/category/:slug',
      name: 'category',
      component: () => import('@/views/Category.vue'), // lazy load
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/views/Cart.vue'), // lazy load
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: () => import('@/views/Checkout.vue'), // lazy load
    },
    {
      path: '/product/:slug',
      name: 'product',
      component: () => import('@/views/Product.vue'), // lazy load
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/About.vue'), // lazy load
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/ContactUs.vue'), // lazy load
    },
    {
      path: '/return-and-refunds',
      name: 'return-and-refunds',
      component: () => import('@/views/ReturnPolicy.vue'), // lazy load
    },
    {
      path: '/terms-and-conditions',
      name: 'terms-and-conditions',
      component: () => import('@/views/TermsAndConditions.vue'), // lazy load
    },
    {
      path: '/not-found',
      name: 'not-found',
      component: ()=> import('@/views/404.vue')
    },
    {
      path: '/thank-you',
      name:'thank-you',
      component: () => import('@/views/ThankYou.vue')
    }
  ],
})

router.beforeEach(async (to, from, next) => {
  console.log('Route guard')
  if (to.name === 'thank-you') {
    const order_id = to.query.order_id

    if (!order_id) return next('/not-found')

    try {
      const res = await api.get(`/orders/verify?order_id=${order_id}`)
      console.log(`Route guard: ${res.data.valid}`)
      if (res.data?.valid) {
        next() // proceed to ThankYou.vue
      } else {
        next('/not-found') // invalid key
      }
    } catch (err) {
      console.error('Order verification failed:', err)
      next('/not-found')
    }
  } else {
    next() // all other routes proceed normally
  }
})

export default router