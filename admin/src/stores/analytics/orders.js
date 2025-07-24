// stores/analytics/ordersAnalyticsStore.js
import { defineStore } from 'pinia'
import api from '@/services/api'

export const useOrdersAnalyticsStore = defineStore('ordersAnalyticsStore', {
  state: () => ({
    summary: null,
    report: [],
    startDate: '',
    endDate: '',
    loading: false,
    error: null,
  }),

  actions: {
    async fetchSummary() {
      try {
        this.loading = true
        const res = await api.get('/analytics/orders')
        this.summary = res.data
      } catch (err) {
        this.error = err.message || 'Failed to load order summary'
      } finally {
        this.loading = false
      }
    },

    async fetchReport() {
      try {
        this.loading = true
        const params = {}
        if (this.startDate) params.start = this.startDate
        if (this.endDate) params.end = this.endDate
        const res = await api.get('/analytics/orders/report', { params })
        this.report = res.data
      } catch (err) {
        this.error = err.message || 'Failed to load order report'
      } finally {
        this.loading = false
      }
    }
  }
})