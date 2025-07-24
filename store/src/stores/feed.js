// src/stores/feed.js
import { defineStore } from 'pinia'
import api from '@/lib/api'

export const useFeedStore = defineStore('feed', {
  state: () => ({
    feed: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchFeed() {
      this.loading = true
      this.error = null

      try {
        const response = await api.get('/feed/')
        this.feed = response.data
      } catch (err) {
        this.error = err.response?.data?.detail || 'Failed to load feed'
        console.error(err)
      } finally {
        this.loading = false
      }
    },
  },
})