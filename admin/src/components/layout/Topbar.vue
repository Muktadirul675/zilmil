<template>
  <header class="bg-white h-16 shadow flex items-center justify-between px-4 border-b">
    <!-- Logo -->
     <RouterLink to="/dashboard">
       <img src="/logo.png" class="h-7" alt="">
     </RouterLink>

    <!-- User Info -->
    <div class="flex items-center gap-2 text-sm text-gray-700">
      <div class="px-2 border-gray-300 border-l border-r">
        <Clock/>
      </div>
      <template v-if="auth.isAdmin">
        <div class="mx-2">
          <ActiveBadge/>
        </div>
      </template>
      <i class="pi pi-user text-gray-500 text-base"></i>
      <span>Welcome,</span>
      <span class="font-semibold">{{ user?.username || 'User' }}</span>

      <!-- Logout Button -->
      <button @click="auth.toggleLogoutModal(true)" class="ml-4 text-red-500 cursor-pointer hover:text-red-600 transition-all text-xs flex items-center gap-1">
        <i class="pi pi-sign-out"></i>
        Logout
      </button>
    </div>
  </header>
</template>4

<script setup>
import { useAuthStore } from '@/stores/auth'
import { RouterLink, useRouter } from 'vue-router'
import { computed } from 'vue'
import ActiveBadge from '../active/ActiveBadge.vue'
import Clock from '../Clock.vue'

const auth = useAuthStore()
const router = useRouter()

const user = computed(() => auth.user)
// console.log(user.value)

const logout = async () => {
  await auth.logout()
  router.push('/login')
}
</script>