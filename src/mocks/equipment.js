export const mockFabs = [
    {
        fabId: 'FAB-A',
        fabName: 'Fab A (반도체)',
        lines: [
            { lineId: 'LINE-1', lineName: 'Line 1', deviceType: 'OHT', totalSlots: 10, minRunning: 7 },
            { lineId: 'LINE-2', lineName: 'Line 2', deviceType: 'OHT', totalSlots: 10, minRunning: 7 },
        ],
    },
    {
        fabId: 'FAB-B',
        fabName: 'Fab B (디스플레이)',
        lines: [
            { lineId: 'LINE-3', lineName: 'Line 3', deviceType: 'AGV', totalSlots: 10, minRunning: 7 },
            { lineId: 'LINE-4', lineName: 'Line 4', deviceType: 'AGV', totalSlots: 10, minRunning: 7 },
        ],
    },
]

const statuses = ['RUNNING', 'RUNNING', 'RUNNING', 'RUNNING', 'RUNNING', 'RUNNING', 'RUNNING', 'STOPPED', 'MAINTENANCE', 'RUNNING']

function generateEquipment(prefix, type, fabId, lineId, count, startIdx) {
    return Array.from({ length: count }, (_, i) => ({
        deviceId: `${prefix}-${String(startIdx + i).padStart(2, '0')}`,
        deviceName: `${prefix}-${String(startIdx + i).padStart(2, '0')}`,
        deviceType: type,
        fabId,
        lineId,
        manufacturer: ['현대', '삼성', 'SEW'][i % 3],
        installer: ['김철수', '이영희', '박민수', '정수진'][i % 4],
        status: statuses[i % statuses.length],
        installDate: '2025-01-15',
    }))
}

export const mockEquipment = [
    ...generateEquipment('OHT', 'OHT', 'FAB-A', 'LINE-1', 10, 1),
    ...generateEquipment('OHT', 'OHT', 'FAB-A', 'LINE-2', 10, 11),
    ...generateEquipment('AGV', 'AGV', 'FAB-B', 'LINE-3', 10, 1),
    ...generateEquipment('AGV', 'AGV', 'FAB-B', 'LINE-4', 10, 11),
]
