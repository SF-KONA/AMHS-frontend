import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import http from '../api/http'
import {
    mapEquipmentListItem,
    mapEquipmentDetail,
    synthesizeFabsFromEquipment,
} from '../api/mappers'

// Mock은 fallback 용도로 남김 (BE 완전 장애 시 수동 복구용, 현재 자동 사용 안 함)
// import { mockFabs, mockEquipment } from '../mocks/equipment'

export const useEquipmentStore = defineStore('equipment', () => {
    const fabs = ref([])
    const equipmentList = ref([])
    const currentDevice = ref(null)
    const selectedFabId = ref(null)
    const selectedLineId = ref(null)
    const loading = ref(false)
    const error = ref('')

    // 선택된 Fab/Line에 해당하는 장비만 필터링
    const filteredEquipment = computed(() => {
        return equipmentList.value.filter((eq) => {
            if (selectedFabId.value && eq.fabId !== selectedFabId.value) return false
            if (selectedLineId.value && eq.lineId !== selectedLineId.value) return false
            return true
        })
    })

    // 상태별 카운트
    const statusCount = computed(() => {
        const list = filteredEquipment.value
        return {
            total: list.length,
            running: list.filter((e) => e.status === 'RUNNING').length,
            stopped: list.filter((e) => e.status === 'STOPPED').length,
            maintenance: list.filter((e) => e.status === 'MAINTENANCE').length,
        }
    })

    /**
     * GET /api/equipments
     * 응답: { equipments: [...], totalElements }
     * 응답 item에는 fabId가 없고 lineId/deviceType은 있음 → 매퍼에서 fabId 추론
     * 로드 후 fabs 구조 자동 합성
     */
    async function fetchEquipment() {
        loading.value = true
        error.value = ''
        try {
            const data = await http.get('/api/equipments')
            const rawList = Array.isArray(data) ? data : data?.equipments || []
            equipmentList.value = rawList.map(mapEquipmentListItem)
            fabs.value = synthesizeFabsFromEquipment(equipmentList.value)
        } catch (err) {
            console.error('[equipmentStore] fetchEquipment failed:', err)
            error.value = '장비 목록을 불러오지 못했습니다.'
            equipmentList.value = []
            fabs.value = []
        } finally {
            loading.value = false
        }
    }

    /**
     * fabs만 로드 (fetchEquipment가 fabs까지 합성하므로 fetchEquipment로 위임)
     * 호환성을 위해 남김
     */
    async function fetchFabs() {
        if (equipmentList.value.length === 0) {
            await fetchEquipment()
        }
    }

    /**
     * GET /api/equipments/{id}
     * 응답: {deviceId, deviceName, deviceType, manufacturer, installer, status, fabId, lineId, ...}
     * currentDevice에 저장 + equipmentList 내 해당 항목도 업데이트 (fabId 실제값으로 교체)
     */
    async function fetchEquipmentDetail(deviceId) {
        if (!deviceId) return null
        loading.value = true
        error.value = ''
        try {
            const data = await http.get(`/api/equipments/${deviceId}`)
            const mapped = mapEquipmentDetail(data)
            currentDevice.value = mapped

            // 목록 내 동일 장비 항목을 상세값으로 보강 (fabId 등)
            const idx = equipmentList.value.findIndex((e) => e.deviceId === deviceId)
            if (idx !== -1) {
                equipmentList.value[idx] = {
                    ...equipmentList.value[idx],
                    ...mapped,
                }
            }

            return mapped
        } catch (err) {
            console.error(`[equipmentStore] fetchEquipmentDetail(${deviceId}) failed:`, err)
            error.value = '장비 상세 정보를 불러오지 못했습니다.'
            currentDevice.value = null
            return null
        } finally {
            loading.value = false
        }
    }

    return {
        fabs,
        equipmentList,
        currentDevice,
        selectedFabId,
        selectedLineId,
        loading,
        error,
        filteredEquipment,
        statusCount,
        fetchFabs,
        fetchEquipment,
        fetchEquipmentDetail,
    }
})
