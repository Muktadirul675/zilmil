// stores/activeUsersStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import { useAuthStore } from './auth'

export const useActiveUsersStore = defineStore('activeUsers', () => {
  const authStore = useAuthStore()
  const activeUsers = ref([]) // [{ username, last_active }]
  const activeCount = ref(0)
  const inactiveUsers = ref(0)
  const intervalId = ref(null)
  const polling = ref(false)

  const fetchActiveUsers = async () => {
    if (!authStore.isAdmin) return
    try {
      const res = await api.get('/auth/active-users/')
      // Expecting response: { count: number, users: [{ username, last_active }] }
      activeUsers.value = res.data.active_users
      inactiveUsers.value = res.data.inactive_users
      activeCount.value = res.data.active_count
      console.log(res.data)
    } catch (err) {
      console.error('Failed to fetch active users:', err)
    }
  }

  const startPolling = () => {
    console.log('validating')
    if (!authStore.isAdmin) return
    console.log('admin checked')
    if(polling.value) return
    console.log('polling')
    fetchActiveUsers() // immediate fetch
    intervalId.value = setInterval(fetchActiveUsers, 1000*60*3) // every 10 seconds
    polling.value = true;
  }

  const stopPolling = () => {
    if (intervalId.value) {
      clearInterval(intervalId.value)
      intervalId.value = null
      polling.value = false;
    }
  }

  const reset = () => {
    stopPolling()
    activeUsers.value = []
    activeCount.value = 0
  }

  return {
    activeUsers,
    inactiveUsers,
    activeCount,
    fetchActiveUsers,
    startPolling,
    stopPolling,
    reset,
  }
})