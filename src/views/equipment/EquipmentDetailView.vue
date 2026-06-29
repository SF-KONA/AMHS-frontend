<template>
    <AppLayout>
        <div class="page-section">
            <h2 class="page-title">장비 상세</h2>

            <div v-if="device" class="detail-card">
                <div class="detail-row">
                    <span class="detail-label">장비 ID</span>
                    <span class="detail-value">{{ device.deviceId }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">장비명</span>
                    <span class="detail-value">{{ device.deviceName || '-' }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">장비 유형</span>
                    <span class="detail-value">{{ device.deviceType }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">소속 Fab</span>
                    <span class="detail-value">{{ fabName }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">소속 Line</span>
                    <span class="detail-value">{{ device.lineId }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">제조사</span>
                    <span class="detail-value">{{ device.manufacturer || '-' }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">설치자</span>
                    <span class="detail-value">{{ device.installer || '-' }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">설치일</span>
                    <span class="detail-value">{{ device.installDate || '-' }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">현재 상태</span>
                    <span class="detail-value">
                        <StatusBadge :status="device.status" />
                    </span>
                </div>
            </div>

            <div v-else class="detail-card detail-empty">
                장비를 찾을 수 없습니다. ({{ route.params.deviceId }})
            </div>

            <div v-if="device" class="tab-card">
                <div class="tab-header">
                    <button
                        :class="['tab-button', { active: activeTab === 'sensor' }]"
                        @click="activeTab = 'sensor'"
                    >
                        센서 차트
                    </button>
                    <button
                        :class="['tab-button', { active: activeTab === 'alert-history' }]"
                        @click="activeTab = 'alert-history'"
                    >
                        알림 히스토리
                    </button>
                </div>

                <div class="tab-body">
                    <SensorChartTab
                        v-if="activeTab === 'sensor'"
                        :device-id="route.params.deviceId"
                    />

                    <AlertHistoryTab
                        v-else-if="activeTab === 'alert-history'"
                        :device-id="route.params.deviceId"
                    />
                </div>
            </div>

            <router-link to="/dashboard" class="back-link">
                ← 대시보드로 돌아가기
            </router-link>
        </div>
    </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '../../layouts/AppLayout.vue'
import StatusBadge from '../../components/common/StatusBadge.vue'
import AlertHistoryTab from './AlertHistoryTab.vue'
import SensorChartTab from './SensorChartTab.vue'
import { useEquipmentStore } from '../../stores/equipmentStore'

const route = useRoute()
const store = useEquipmentStore()
const activeTab = ref('sensor')

// 현재 장비 객체 — currentDevice(상세 API) 우선, 없으면 list에서 find (fallback)
const device = computed(() => {
    const id = route.params.deviceId
    if (store.currentDevice && store.currentDevice.deviceId === id) {
        return store.currentDevice
    }
    return store.equipmentList.find((e) => e.deviceId === id) || null
})

// 소속 Fab 이름
const fabName = computed(() => {
    if (!device.value) return '-'
    const fab = store.fabs.find((f) => f.fabId === device.value.fabId)
    return fab ? fab.fabName : device.value.fabId || '-'
})

// store 데이터 보장 (대시보드 거치지 않고 직접 URL 진입 시)
onMounted(() => {
    if (!store.equipmentList.length) store.fetchEquipment()
    store.fetchEquipmentDetail(route.params.deviceId)
})

// URL 파라미터 변경 시 상세 재-fetch (다른 장비로 이동)
watch(
    () => route.params.deviceId,
    (newId) => {
        if (newId) store.fetchEquipmentDetail(newId)
    },
)
</script>

<style scoped>
.page-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.page-title {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    color: var(--color-text);
}

.detail-card,
.tab-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 20px;
}

.detail-row {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid var(--color-border);
}

.detail-row:last-child {
    border-bottom: none;
}

.detail-label {
    font-size: 14px;
    color: var(--color-text-muted);
}

.detail-value {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text);
}

.tab-header {
    display: flex;
    gap: 10px;
    margin-bottom: 16px;
    border-bottom: 1px solid var(--color-border);
    padding-bottom: 12px;
}

.tab-button {
    padding: 10px 14px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-bg);
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text);
}

.tab-button.active {
    background: var(--color-text);
    color: #ffffff;
    border-color: var(--color-text);
}

.tab-body {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.placeholder-box {
    min-height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed var(--color-border);
    border-radius: 12px;
    background: var(--color-bg);
    color: var(--color-text-muted);
    font-size: 14px;
}

.detail-empty {
    text-align: center;
    padding: 32px 20px;
    color: var(--color-text-muted);
    font-size: 14px;
}

.back-link {
    color: var(--color-interest);
    text-decoration: none;
    font-weight: 600;
}

.back-link:hover {
    text-decoration: underline;
}
</style>