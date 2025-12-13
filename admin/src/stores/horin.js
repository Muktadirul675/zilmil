// src/stores/horin.js
import { defineStore } from 'pinia'
import { reactive } from 'vue'
import api from '@/services/api' // your custom axios instance
import { showDrfErrors } from '@/lib/drf'

export const useHorinStore = defineStore('horin', () => {
  // Object refs to store data per phone number
  const couriers = reactive({})
  const parcels = reactive({})

  // Fetch courier summary
  async function getCouriers(number) {
    if (!number) return null

    // Return cached data if exists
    if (couriers[number]) return couriers[number]

    try {
      const { data } = await api.get('/courier/summary', {
        params: { number }
      })
      couriers[number] = data
      return data
    } catch (err) {
      showDrfErrors(err)
      return null
    }
  }

  // Fetch parcel summary
  async function getParcels(number) {
    if (!number) return null

    // Return cached data if exists
    if (parcels[number]) return parcels[number]

    try {
      const { data } = await api.get('/courier/parcels', {
        params: { number }
      })
      parcels[number] = data
      return data
    } catch (err) {
      console.log('PARCEL ERROR')
      showDrfErrors(err)
      return null
    }
  }

  return {
    couriers,
    parcels,
    getCouriers,
    getParcels
  }
})