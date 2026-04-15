import { defineStore } from 'pinia'

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
    },
})