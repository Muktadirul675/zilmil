import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

import Dashboard from '@/pages/Dashboard.vue'
import Users from '@/pages/Users.vue'
import Products from '@/pages/Products.vue'
import Logs from '@/pages/Logs.vue'
import AddProduct from '@/pages/AddProduct.vue'
import Orders from '@/pages/Orders.vue'
import AddOrder from '@/pages/AddOrder.vue'
import Login from '@/pages/Login.vue'
import AddStock from '@/pages/AddStock.vue'
import Notice from '@/pages/Notice.vue'
import FeedBuilder from '@/pages/FeedBuilder.vue'

import { useAuthStore } from '@/stores/auth'
import EditProduct from '@/pages/EditProduct.vue'
import EditOrder from '@/pages/EditOrder.vue'
import Settings from '@/pages/Settings.vue'
import ReadyForCourier from '@/pages/ReadyForCourier.vue'

const routes = [
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', component: Dashboard },
      { path: 'users', component: Users },
      { path: 'products', component: Products },
      { path: 'products/add', component: AddProduct },
      {
        path: '/products/:id',
        name: 'ProductEdit',
        component: EditProduct,
      },{
        path: '/orders/:id',
        name: 'OrdersEdit',
        component: EditOrder,
      },
      { path: 'orders', component: Orders },
      { path: 'orders/add', component: AddOrder },
      { path: 'logs', component: Logs },
      { path: 'settings', component: Settings },
      { path: 'builder', component: FeedBuilder },
      { path: 'products/stocks/add', component: AddStock },
      { path: 'couriers', component: ReadyForCourier },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// â Global Navigation Guard
// router/index.js
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  if (!auth.isAuthenticated) {
    await auth.fetchUser()
  }

  const isLoggedIn = auth.isAuthenticated

  if (to.path === '/login') {
    isLoggedIn ? next('/dashboard') : next()
  } else {
    isLoggedIn ? next() : next('/login')
  }
})

export default router;