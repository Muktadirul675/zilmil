// stores/authStore.js
import { defineStore } from 'pinia'
import axios from '@/services/api' // this should have your Axios instance with auth interceptor
import { useRoute, useRouter } from 'vue-router'
import { useActiveUsersStore } from './active'
import api from '@/services/api'

export const useAuthStore = defineStore('authStore', {
    state: () => ({
        user: null,
        access: localStorage.getItem('access') || null,
        refresh: localStorage.getItem('refresh') || null,
        isAuthenticated: false,
        isLogoutModalOpen: false
    }),

    getters: {
        isAdmin: (state) => {
            return state.user?.groups?.some((group) => group.name === 'Admin') || false
        },
        isStaff: (state) => {
            return state.user?.groups?.some((group) => group.name === 'Staff') || false
        }
    },

    actions: {
        toggleLogoutModal(val){
            this.isLogoutModalOpen = val;
        },
        async login(credentials) {
            try {
                const res = await axios.post('/auth/login/', credentials)
                const { access, refresh } = res.data

                // Save tokens
                this.access = access
                this.refresh = refresh
                localStorage.setItem('access', access)
                localStorage.setItem('refresh', refresh)

                // Set user and auth state
                await this.fetchUser()
                this.isAuthenticated = true
                return true
            } catch (err) {
                throw new Error('Invalid credentials')
            }
        },

        async fetchUser() {
            if (!this.access) return
            try {
                const res = await axios.get('/auth/user/', {
                    headers: {
                        Authorization: `Bearer ${this.access}`,
                    },
                })
                this.user = res.data || null
                this.isAuthenticated = this.user !== null ? true : false
                if (this.user?.groups?.some((group) => group.name === 'Admin')) {
                    const activeStore = useActiveUsersStore()
                    activeStore.startPolling()
                }
            } catch {
                this.logout()
            }
        },

        async logout(all=undefined) {
            try {
                let logoutAll = all;
                if (logoutAll) {
                    try {
                        await api.post("/auth/logout-all/");
                    } catch (error) {
                        console.warn("Failed to log out from all devices:", error);
                        // continue regardless of failure
                    }
                }
            } finally {
                // Always clear local session
                this.user = null;
                this.access = null;
                this.refresh = null;
                this.isAuthenticated = false;
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
            }
        }
    },
})