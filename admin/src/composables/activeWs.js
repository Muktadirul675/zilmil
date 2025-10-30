import { getWsProtocol } from '@/services/utils'
import { useAuthStore } from '@/stores/auth'
import { ref, onMounted, onUnmounted } from 'vue'

export function usePageWS(path, useToken=true) {
    const ws = ref(null)
    const viewers = ref([])
    const auth = useAuthStore()
    const BACKEND_URL_BASE = import.meta.env.VITE_BACKEND_URL_BASE
    const protocol = getWsProtocol()
    const token = localStorage.getItem('access')

    onMounted(() => {
        if (!auth.isAuthenticated) return
        if(useToken){
            ws.value = new WebSocket(`${protocol}://${BACKEND_URL_BASE}/ws/page${path}/?token=${token}`)
        }else{
            ws.value = new WebSocket(`${protocol}://${BACKEND_URL_BASE}/ws/page${path}/?token=${token}&include=false`)
        }

        ws.value.onopen = () => {
            console.log('Connected to page WS')
            // Start pinging every 10s
            setInterval(() => {
                ws.value.send(JSON.stringify({ action: 'ping' }))
            }, 10000)
        }

        ws.value.onmessage = (event) => {
            const data = JSON.parse(event.data)
            if (data) viewers.value = data
        }
    })

    onUnmounted(() => {
        if (ws.value) ws.value.close()
    })

    return { viewers }
}