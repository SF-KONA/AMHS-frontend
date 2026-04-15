<template>
    <AppLayout>
        <div class="page-section">
            <h2 class="page-title">알림 이력</h2>

            <DataTable
                :columns="columns"
                :data="alertRows"
                :loading="false"
            >
                <template #level="{ row }">
                    <StatusBadge :status="mapLevelToStatus(row.level)" />
                </template>

                <template #acknowledged="{ row }">
                    <span :class="['ack-text', { done: row.acknowledged }]">
                        {{ row.acknowledged ? '확인 완료' : '미확인' }}
                    </span>
                </template>

                <template #action="{ row }">
                    <button
                        class="ack-button"
                        :disabled="row.acknowledged"
                        @click.stop="handleAcknowledge(row.alertId)"
                    >
                        확인
                    </button>
                </template>
            </DataTable>
        </div>
    </AppLayout>
</template>

<script setup>
import { computed } from 'vue'
import AppLayout from '../../layouts/AppLayout.vue'
import DataTable from '../../components/common/DataTable.vue'
import StatusBadge from '../../components/common/StatusBadge.vue'
import { useAlertStore } from '../../stores/alertStore'

const alertStore = useAlertStore()

const columns = [
    { key: 'createdAt', label: '시각' },
    { key: 'eqId', label: '장비' },
    { key: 'level', label: '등급', slot: true },
    { key: 'sensorName', label: '센서' },
    { key: 'sensorValue', label: '값' },
    { key: 'acknowledged', label: '확인 여부', slot: true },
    { key: 'action', label: '처리', slot: true },
]

const alertRows = computed(() => alertStore.alertList)

function handleAcknowledge(alertId) {
    alertStore.acknowledgeAlert(alertId)
}

function mapLevelToStatus(level) {
    const map = {
        WARNING: 'WARNING',
        ERROR: 'ERROR',
        CAUTION: 'IDLE',
        NORMAL: 'RUNNING',
    }

    return map[level] || 'IDLE'
}
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

.ack-text {
    font-size: 13px;
    font-weight: 600;
    color: var(--color-danger);
}

.ack-text.done {
    color: var(--color-normal);
}

.ack-button {
    height: 32px;
    padding: 0 12px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-surface);
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
}

.ack-button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}
</style>