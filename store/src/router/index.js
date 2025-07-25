import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Product from '@/views/Product.vue'
import Cart from '@/views/Cart.vue'
import Checkout from '@/views/Checkout.vue'
import Category from '@/views/Category.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path:'/category/:slug',
      name:'category',
      component: Category
    },
    {
      path:'/cart',
      name:'cart',
      component: Cart
    },
    {
      path:'/checkout',
      name:'checkout',
      component: Checkout
    },
    {
      path:'/:slug',
      name:'product',
      component: Product
    },
  ],
})

export default router
