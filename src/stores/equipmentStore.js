import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { mockFabs, mockEquipment } from '../mocks/equipment'

export const useEquipmentStore = defineStore('equipment', () => {
    const fabs = ref([])
    const equipmentList = ref([])
    const selectedFabId = ref(null)
    const selectedLineId = ref(null)
    const loading = ref(false)

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

    // Mock 데이터 로드 (나중에 API로 교체)
    async function fetchFabs() {
        loading.value = true
        try {
            // TODO: API 연동 시 아래로 교체
            // const res = await http.get('/api/fab')
            // fabs.value = res.data
            fabs.value = mockFabs
        } finally {
            loading.value = false
        }
    }

    async function fetchEquipment() {
        loading.value = true
        try {
            // TODO: API 연동 시 아래로 교체
            // const res = await http.get('/api/equipment')
            // equipmentList.value = res.data
            equipmentList.value = mockEquipment
        } finally {
            loading.value = false
        }
    }

    return {
        fabs,
        equipmentList,
        selectedFabId,
        selectedLineId,
        loading,
        filteredEquipment,
        statusCount,
        fetchFabs,
        fetchEquipment,
    }
})
