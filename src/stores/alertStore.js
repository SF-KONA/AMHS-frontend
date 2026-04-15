import { defineStore } from 'pinia'

export const useAlertStore = defineStore('alert', {
    state: () => ({
        alertList: [
            {
                alertId: 1,
                eqId: 'OHT-03',
                level: 'WARNING',
                sensorName: 'PM10',
                sensorValue: 58,
                createdAt: '2026-04-15 09:10:00',
                acknowledged: false,
            },
            {
                alertId: 2,
                eqId: 'AGV-07',
                level: 'ERROR',
                sensorName: 'NTC',
                sensorValue: 84,
                createdAt: '2026-04-15 09:12:00',
                acknowledged: false,
            },
            {
                alertId: 3,
                eqId: 'OHT-11',
                level: 'WARNING',
                sensorName: 'IR_TEMP_MAX',
                sensorValue: 72,
                createdAt: '2026-04-15 09:15:00',
                acknowledged: true,
            },
        ],
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
    },
})