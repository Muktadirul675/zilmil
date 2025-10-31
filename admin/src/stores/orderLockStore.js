// stores/orderLockStore.js
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useOrderLockStore = defineStore('orderLock', () => {
  // Key: orderId, Value: lockedBy (username)
  const locks = ref({})

  // Connect to WS
  function connect() {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL_BASE
    const wsUrl = `${wsProtocol}://${BACKEND_URL}/ws/order/lock/`
    const ws = new WebSocket(wsUrl)
    console.log('Lock Store')
    ws.onmessage = (event) => {
      console.log('Lock message')
      try {
        const data = JSON.parse(event.data)
        // Expecting: { locks: { orderId: username } }
        if (data) {
          locks.value = data
        }
        console.log(`Locks: ${JSON.stringify(locks.value)}`)
        console.log(`Locks D: ${JSON.stringify(data)}`)
      } catch (err) {
        console.error('Invalid WS message', err)
      }
    }

    ws.onclose = () => {
      console.log('Order lock WS disconnected')
    }

    return ws
  }

  // Helpers
  function isLocked(orderId) {
    return computed(()=>!!locks.value[orderId])
  }

  function isLockedBy(orderId) {
    return computed(()=>locks.value[orderId] || null)
  }

  return { locks, connect, isLocked, isLockedBy }
})