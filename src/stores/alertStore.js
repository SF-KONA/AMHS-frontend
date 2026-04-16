import { defineStore } from 'pinia'

const TOAST_DURATION_MS = 5000
let toastIdCounter = 0

export const useAlertStore = defineStore('alert', {
    state: () => ({
        alertList: [
            {
                alertId: 1,
                deviceId: 'OHT-03',
                level: 'WARNING',
                sensorName: 'PM10',
                sensorValue: 58,
                createdAt: '2026-04-15 09:10:00',
                acknowledged: false,
            },
            {
                alertId: 2,
                deviceId: 'AGV-07',
                level: 'ERROR',
                sensorName: 'NTC',
                sensorValue: 84,
                createdAt: '2026-04-15 09:12:00',
                acknowledged: false,
            },
            {
                alertId: 3,
                deviceId: 'OHT-11',
                level: 'WARNING',
                sensorName: 'IR_TEMP_MAX',
                sensorValue: 72,
                createdAt: '2026-04-15 09:15:00',
                acknowledged: true,
            },
        ],
        toastQueue: [],
    }),

    getters: {
        unreadCount(state) {
            return state.alertList.filter((alert) => !alert.acknowledged).length
        },
    },

    actions: {
        acknowledgeAlert(alertId) {
            const target = this.alertList.find((alert) => alert.alertId === alertId)

            if (target) {
                target.acknowledged = true
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