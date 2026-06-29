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
        const url = error.config?.url || ''
        // 로그인 API 자체의 401은 inline 에러로 처리 (리다이렉트 루프 방지)
        const isLoginApi = url.includes('/auth/login')
        if (error.response?.status === 401 && !isLoginApi) {
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

export default http
