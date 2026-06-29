import { defineStore } from 'pinia'
import http from '../api/http'
import { mapAlert } from '../api/mappers'

const TOAST_DURATION_MS = 5000
let toastIdCounter = 0

export const useAlertStore = defineStore('alert', {
    state: () => ({
        alertList: [],
        toastQueue: [],
        loading: false,
        error: '',
        loaded: false,
    }),

    getters: {
        unreadCount(state) {
            return state.alertList.filter((alert) => !alert.acknowledged).length
        },
    },

    actions: {
        /**
         * GET /api/alerts
         * BE 응답: [{alertId, deviceId, alertLevel, sensorName, sensorValue, acknowledged, createdAt, ackAt}, ...]
         */
        async fetchAlerts() {
            this.loading = true
            this.error = ''
            try {
                const data = await http.get('/api/alerts')
                const list = Array.isArray(data) ? data : data?.alerts || []
                this.alertList = list.map(mapAlert)
                this.loaded = true
            } catch (err) {
                console.error('[alertStore] fetchAlerts failed:', err)
                this.error = '알림 목록을 불러오지 못했습니다.'
            } finally {
                this.loading = false
            }
        },

        /**
         * PATCH /api/alerts/{alertId}/ack
         * 성공 시 로컬 상태도 갱신
         */
        async acknowledgeAlert(alertId) {
            try {
                await http.patch(`/api/alerts/${alertId}/ack`)
                const target = this.alertList.find((alert) => alert.alertId === alertId)
                if (target) {
                    target.acknowledged = true
                    target.ackAt = new Date().toISOString()
                }
            } catch (err) {
                console.error(`[alertStore] acknowledgeAlert(${alertId}) failed:`, err)
                // 실패 시 UI 상태 변경 없이 에러만 기록 (사용자는 버튼 재시도 가능)
                this.error = '알림 확인에 실패했습니다.'
            }
        },

        addAlert(alert) {
            this.alertList.unshift(alert)
        },

        pushToast(toast) {
            const toastId = ++toastIdCounter
            this.toastQueue.push({
                toastId,
                level: (toast && toast.level) || 'WARNING',
                deviceId: toast && toast.deviceId,
                sensorName: toast && toast.sensorName,
                sensorValue: toast && toast.sensorValue,
                message: toast && toast.message,
            })
            setTimeout(() => {
                this.removeToast(toastId)
            }, TOAST_DURATION_MS)
        },

        removeToast(toastId) {
            const idx = this.toastQueue.findIndex((t) => t.toastId === toastId)
            if (idx !== -1) {
                this.toastQueue.splice(idx, 1)
            }
        },
    },
})