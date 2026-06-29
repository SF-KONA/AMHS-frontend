<template>
    <div class="dashboard">
        <!-- 상태 카운트 카드 -->
        <div class="status-summary">
            <div class="status-card" style="border-left: 4px solid var(--color-normal)">
                <span class="status-count">{{ statusCount.running }}</span>
                <span class="status-label">가동</span>
            </div>
            <div class="status-card" style="border-left: 4px solid var(--color-danger)">
                <span class="status-count">{{ statusCount.stopped }}</span>
                <span class="status-label">정지</span>
            </div>
            <div class="status-card" style="border-left: 4px solid var(--color-warning)">
                <span class="status-count">{{ statusCount.maintenance }}</span>
                <span class="status-label">정비</span>
            </div>
            <div class="status-card" style="border-left: 4px solid var(--color-border)">
                <span class="status-count">{{ statusCount.total }}</span>
                <span class="status-label">전체</span>
            </div>
        </div>

        <!-- Fab 탭 -->
        <div class="fab-tabs">
            <button
                v-for="fab in fabs"
                :key="fab.fabId"
                :class="['fab-tab', { active: selectedFabId === fab.fabId }]"
                @click="selectFab(fab.fabId)"
            >
                {{ fab.fabName }}
            </button>
        </div>

        <!-- Line 패널 -->
        <div class="line-panels">
            <div v-for="line in currentLines" :key="line.lineId" class="line-panel">
                <div class="line-header">
                    <h3>{{ line.lineName }}</h3>
                    <span class="line-type">{{ line.deviceType }}</span>
                    <span class="line-stats">
                        가동 {{ getLineStats(line.lineId).running }} /
                        정지 {{ getLineStats(line.lineId).stopped }} /
                        정비 {{ getLineStats(line.lineId).maintenance }}
                    </span>
                </div>

                <!-- 장비 카드 그리드 -->
                <div class="equipment-grid">
                    <div
                        v-for="eq in getLineEquipment(line.lineId)"
                        :key="eq.deviceId"
                        :class="['equipment-card', `status-${eq.status.toLowerCase()}`]"
                        @click="goToDetail(eq.deviceId)"
                    >
                        <div class="device-status-dot" :style="{ background: getStatusColor(eq.status) }"></div>
                        <div class="device-info">
                            <span class="device-id">{{ eq.deviceId }}</span>
                            <span class="device-type">{{ eq.deviceType }}</span>
                        </div>
                        <span class="device-status-text" :style="{ color: getStatusColor(eq.status) }">
                            {{ getStatusLabel(eq.status) }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEquipmentStore } from '../../stores/equipmentStore'

const router = useRouter()
const store = useEquipmentStore()

const fabs = computed(() => store.fabs)
const selectedFabId = computed(() => store.selectedFabId)
const statusCount = computed(() => store.statusCount)

// 선택된 Fab의 Line 목록
const currentLines = computed(() => {
    const fab = fabs.value.find((f) => f.fabId === selectedFabId.value)
    return fab ? fab.lines : []
})

// Fab 선택
function selectFab(fabId) {
    store.selectedFabId = fabId
    store.selectedLineId = null
}

// Line별 장비 필터
function getLineEquipment(lineId) {
    return store.equipmentList.filter((eq) => eq.lineId === lineId)
}

// Line별 상태 카운트
function getLineStats(lineId) {
    const list = getLineEquipment(lineId)
    return {
        running: list.filter((e) => e.status === 'RUNNING').length,
        stopped: list.filter((e) => e.status === 'STOPPED').length,
        maintenance: list.filter((e) => e.status === 'MAINTENANCE').length,
    }
}

// 상태 → 색상
function getStatusColor(status) {
    const map = {
        RUNNING: 'var(--color-normal)',
        STOPPED: 'var(--color-danger)',
        MAINTENANCE: 'var(--color-warning)',
    }
    return map[status] || 'var(--color-text-muted)'
}

// 상태 → 한글 라벨
function getStatusLabel(status) {
    const map = {
        RUNNING: '가동',
        STOPPED: '정지',
        MAINTENANCE: '정비',
    }
    return map[status] || status
}

// 장비 상세 이동
function goToDetail(deviceId) {
    router.push(`/dashboard/${deviceId}`)
}

onMounted(() => {
    store.fetchFabs()
    store.fetchEquipment()
    // 첫 번째 Fab 자동 선택
    if (!store.selectedFabId && store.fabs.length > 0) {
        store.selectedFabId = store.fabs[0].fabId
    }
})
</script>

<style scoped>
.dashboard {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
}

/* 상태 카운트 카드 */
.status-summary {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    margin-bottom: 24px;
}

.status-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.status-count {
    font-size: 28px;
    font-weight: 700;
}

.status-label {
    font-size: 13px;
    color: var(--color-text-muted);
}

/* Fab 탭 */
.fab-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
}

.fab-tab {
    padding: 10px 24px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-surface);
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text-muted);
    transition: all 0.2s;
}

.fab-tab:hover {
    border-color: var(--color-text-muted);
}

.fab-tab.active {
    background: var(--color-text);
    color: #fff;
    border-color: var(--color-text);
}

/* Line 패널 */
.line-panels {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.line-panel {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 20px;
}

.line-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--color-border);
}

.line-header h3 {
    font-size: 16px;
    font-weight: 700;
    margin: 0;
}

.line-type {
    background: var(--color-bg);
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    color: var(--color-text-muted);
}

.line-stats {
    margin-left: auto;
    font-size: 13px;
    color: var(--color-text-muted);
}

/* 장비 카드 그리드 */
.equipment-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
}

.equipment-card {
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 12px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.equipment-card:hover {
    border-color: var(--color-text-muted);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.device-status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
}

.device-info {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.device-id {
    font-size: 14px;
    font-weight: 600;
}

.device-type {
    font-size: 11px;
    color: var(--color-text-muted);
}

.device-status-text {
    font-size: 12px;
    font-weight: 600;
}

/* 반응형 */
@media (max-width: 900px) {
    .equipment-grid {
        grid-template-columns: repeat(3, 1fr);
    }
    .status-summary {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 600px) {
    .equipment-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
</style>