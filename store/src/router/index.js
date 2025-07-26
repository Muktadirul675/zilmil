import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'HomeView',
      component: () => import('@/views/HomeView.vue'),
      meta:{keepAlive: true},
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
      path: '/:slug',
      name: 'product',
      component: () => import('@/views/Product.vue'), // lazy load
    },
  ],
})

export default router