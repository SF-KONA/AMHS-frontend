import { defineStore } from 'pinia'

export const useMaintenanceStore = defineStore('maintenance', {
    state: () => ({
        orderList: [
            {
                orderId: 'MO-001',
                deviceId: 'OHT-03',
                lineId: 'LINE-1',
                priority: 'HIGH',
                status: 'OPEN',
                actionMemo: '',
            },
            {
                orderId: 'MO-002',
                deviceId: 'OHT-11',
                lineId: 'LINE-2',
                priority: 'MEDIUM',
                status: 'ASSIGNED',
                actionMemo: '',
            },
            {
                orderId: 'MO-003',
                deviceId: 'AGV-07',
                lineId: 'LINE-3',
                priority: 'HIGH',
                status: 'IN_PROGRESS',
                actionMemo: '',
            },
            {
                orderId: 'MO-004',
                deviceId: 'AGV-12',
                lineId: 'LINE-4',
                priority: 'LOW',
                status: 'COMPLETED',
                actionMemo: '',
            },
        ],
    }),

    actions: {
        updateOrderStatus(orderId, nextStatus) {
            const target = this.orderList.find((order) => order.orderId === orderId)
            if (target) {
                target.status = nextStatus
            }
        },

        updateOrderMemo(orderId, memo) {
            const target = this.orderList.find((order) => order.orderId === orderId)
            if (target) {
                target.actionMemo = memo
            }
        },

        addOrder(order) {
            this.orderList.unshift(order)
        },
    },
})