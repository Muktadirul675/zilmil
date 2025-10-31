// composables/useOrderLock.js
import { getCurrentInstance, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function useOrderLock(orderId) {
  const authStore = useAuthStore()
  const userId = authStore.user?.id
  if (!userId) {
    console.warn('No authenticated user found for order lock WS')
    return
  }

  const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL_BASE
  const wsUrl = `${wsProtocol}://${BACKEND_URL}/ws/order/lock/?id=${orderId}&user_id=${userId}`

  const ws = new WebSocket(wsUrl)

  ws.onopen = () => {
    console.log(`Connected to order lock WS for order ${orderId}`)
  }

  ws.onmessage = (event) => {
    // No handling in the composable, just keep WS alive
  }

  ws.onclose = () => {
    console.log(`Order lock WS closed for order ${orderId}`)
  }

  onBeforeUnmount(() => {
    ws.close()
  })

  return ws
}