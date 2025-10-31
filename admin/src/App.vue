<script setup>
import { onBeforeMount, onMounted, ref } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import 'vue3-toastify/dist/index.css';
import Toaster from './components/Toaster.vue';
import { useActivityStore } from './stores/activities';
import { useVisitsAnalyticsStore } from './stores/analytics/visits';
import { useAuthStore } from './stores/auth';
import { useBuilderStore } from './stores/builder';
import { useOrderStore } from './stores/orders';
import { useProductStore } from './stores/products';
import { useSettingsStore } from './stores/settings';
import { useOrderLockStore } from './stores/orderLockStore';
import { effect } from 'vue';
import BaseModal from './components/ui/BaseModal.vue';
import { toast } from './services/toast';
import { getProtocol } from './services/utils';

const auth = useAuthStore()
const products = useProductStore()
const orders = useOrderStore()
const builder = useBuilderStore()
const activity = useActivityStore()
const visits = useVisitsAnalyticsStore()
const settings = useSettingsStore()
const locks = useOrderLockStore()
const router = useRouter()
const init = ref(true)

const vi = ref(null);

onBeforeMount(async () => {
  await auth.fetchUser()
  if (!auth.isAuthenticated) auth.logout(false)
  init.value = false
})

effect(() => {
  if (auth.isAuthenticated) {
    locks.connect()
    orders.initOrderSocket()
    if (auth.isAdmin) {
      console.log('isAdmin')
      products.initProductSocket()
      activity.connectWebSocket()
      async function getDatas() {
        await Promise.all([
          builder.init(),
          activity.fetchActivities(),
          visits.fetchAll(),
          settings.fetchSettings()
        ])
      }
      getDatas()
      if (!vi.value) {
        const i = setInterval(() => {
          visits.fetchAll()
        }, 1000 * 60 * 2)
        vi.value = i;
      }
    }
  }else{
    if(!init.value){
      router.push('/login')
    }
  }
})

const loggingOut = ref(false)

function logOutSingle(){
  loggingOut.value=true;
  try{
    auth.logout(false)
  }catch(e){
    toast.error(e)
  }finally{
    loggingOut.value = false
    auth.toggleLogoutModal(false)
  }
}

function logOutAll(){
  loggingOut.value=true;
  try{
    auth.logout(true)
  }catch(e){
    toast.error(e)
  }finally{
    loggingOut.value = false
    auth.toggleLogoutModal(false)
  }
}

onMounted(()=>{
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL_BASE
  const logOutWs = new WebSocket(`${getProtocol()}://${BACKEND_URL}/ws/user/logout`)
  logOutWs.onmessage = (event) => {
  const data = JSON.parse(event.data)
  if (data.logout === auth.user.id) {  // note: your backend sends 'lgot', not 'logout'
    auth.logout(false)
  }
}
}) 
</script>

<template>
  <RouterView />
  <Toaster />
  <BaseModal :model-value="auth.isLogoutModalOpen" @close="auth.toggleLogoutModal(false)">
    <div v-if="loggingOut">
      <div class="text-lg text-red-500">
        <i class="pi pi-spin pi-spinner"></i>
        Logging out
      </div>
    </div>
    <template v-else>
      <h6 class="text-3xl mb-2">Logout from all devices?</h6>
      <div class="flex items-center gap-2">
        <button @click="()=>auth.toggleLogoutModal(false)" class="px-2 py-1 rounded text-bpack bg-gray-300">Cancel</button>
        <button @click="logOutSingle" class="px-2 py-1 rounded text-white bg-red-500">No</button>
        <button @click="logOutAll" class="px-2 py-1 rounded text-white bg-blue-500">Yes</button>
      </div>
    </template>
  </BaseModal>
</template>
