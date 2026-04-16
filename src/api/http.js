import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    timeout: 10000,
})

// 요청 인터셉터 — JWT Authorization 헤더 자동 첨부
// NOTE: useAuthStore()를 콜백 안에서 호출해야 Pinia 초기화 이후에 실행됨
http.interceptors.request.use((config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
        config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
})

// 응답 인터셉터 — 공통 에러 처리
http.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response?.status === 401) {
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default http
