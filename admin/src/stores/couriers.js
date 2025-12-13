// stores/couriers.js
import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import api from '@/services/api'
import { handleError } from '@/services/errors'

export const useCourierStore = defineStore('courier', () => {
  // state
  const couriers = ref([])
  const loading = ref(false)
  const selected = ref([])

  const filters = reactive({
    search: '',
    city_id: '',
    zone_id: '',
  })

  const sendingStatus = reactive({})
  const sendingErrors = reactive({})

  // getters
  const allSelected = computed(() => {
    return couriers.value.length && selected.value.length === couriers.value.length
  })

  // actions
  const fetchCouriers = async () => {
    loading.value = true
    try {
      const params = {
        search: filters.search || undefined,
        'order__city_id': filters.city_id || undefined,
        'order__zone_id': filters.zone_id || undefined,
      }
      const res = await api.get('/orders/ready-for-courier/', { params })
      couriers.value = res.data
      selected.value = []
      Object.keys(sendingStatus).forEach(k => delete sendingStatus[k])
      Object.keys(sendingErrors).forEach(k => delete sendingErrors[k])
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  const toggleSelection = (id) => {
    selected.value.includes(id)
      ? (selected.value = selected.value.filter(i => i !== id))
      : selected.value.push(id)
  }

  const toggleAll = () => {
    if (allSelected.value) {
      selected.value = []
    } else {
      selected.value = couriers.value.map(c => c.id)
    }
  }

  const sendSelectedToCourier = async () => {
    for (const id of selected.value) {
      sendingStatus[id] = 'sending'
      sendingErrors[id] = null

      const order = couriers.value.find(c => c.id === id).order

      try {
        await api.post(`/orders/${order.id}/ship/`)
        couriers.value = couriers.value.filter(o => o.id !== id)
        selected.value = selected.value.filter(sel => sel !== id)
        delete sendingStatus[id]
        delete sendingErrors[id]
      } catch (err) {
        handleError(err)
        sendingStatus[id] = 'error'
        sendingErrors[id] = err?.response?.data?.message || 'Failed to send'
      }
    }
  }

  return {
    couriers,
    loading,
    selected,
    filters,
    sendingStatus,
    sendingErrors,
    allSelected,
    fetchCouriers,
    toggleSelection,
    toggleAll,
    sendSelectedToCourier,
  }
})