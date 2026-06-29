import { defineStore } from 'pinia'
import http from '../api/http'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || '',
        user: JSON.parse(localStorage.getItem('user') || 'null'),
        role: localStorage.getItem('role') || '',
    }),

    getters: {
        isLoggedIn(state) {
            return !!state.token
        },
    },

    actions: {
        login({ token, user, role }) {
            this.token = token
            this.user = user
            this.role = role

            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))
            localStorage.setItem('role', role)
        },

        logout() {
            this.token = ''
            this.user = null
            this.role = ''

            localStorage.removeItem('token')
            localStorage.removeItem('user')
            localStorage.removeItem('role')
        },

        /**
         * BE 로그인 API 호출
         * POST /api/auth/login { loginId, password }
         * → { success, message, token, role }
         * 성공 시 스토어 상태 + localStorage 저장
         * 반환: { success: boolean, message: string }
         */
        async loginWithApi(loginId, password) {
            try {
                const data = await http.post('/api/auth/login', { loginId, password })

                // BE가 success=false를 명시적으로 주는 경우
                if (data && data.success === false) {
                    return { success: false, message: data.message || '로그인 실패' }
                }

                if (!data || !data.token) {
                    return { success: false, message: '서버 응답이 올바르지 않습니다.' }
                }

                this.login({
                    token: data.token,
                    user: { loginId },
                    role: data.role || '',
                })

                return { success: true, message: data.message || '로그인 성공' }
            } catch (err) {
                console.error('[authStore] loginWithApi failed:', err)
                const message =
                    err.response?.data?.message ||
                    (err.response?.status === 401
                        ? '아이디 또는 비밀번호가 올바르지 않습니다.'
                        : '로그인 중 오류가 발생했습니다.')
                return { success: false, message }
            }
        },
    },
})