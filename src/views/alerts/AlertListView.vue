<template>
    <AppLayout>
        <div class="page-section">
            <h2 class="page-title">알림 이력</h2>

            <FilterBar
                v-model="filterValues"
                :filters="filters"
            />

            <DataTable
                :columns="columns"
                :data="filteredAlerts"
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
import { computed, ref } from 'vue'
import AppLayout from '../../layouts/AppLayout.vue'
import FilterBar from '../../components/common/FilterBar.vue'
import DataTable from '../../components/common/DataTable.vue'
import StatusBadge from '../../components/common/StatusBadge.vue'
import { useAlertStore } from '../../stores/alertStore'

const alertStore = useAlertStore()

const filterValues = ref({
    level: '',
    eqId: '',
    acknowledged: '',
})

const columns = [
    { key: 'createdAt', label: '시각' },
    { key: 'eqId', label: '장비' },
    { key: 'level', label: '등급', slot: true },
    { key: 'sensorName', label: '센서' },
    { key: 'sensorValue', label: '값' },
    { key: 'acknowledged', label: '확인 여부', slot: true },
    { key: 'action', label: '처리', slot: true },
]

const filters = computed(() => {
    const eqOptions = Array.from(
        new Set(alertStore.alertList.map((alert) => alert.eqId))
    ).map((eqId) => ({
        value: eqId,
        label: eqId,
    }))

    return [
        {
            key: 'level',
            label: '등급',
            options: [
                { value: 'WARNING', label: '경고' },
                { value: 'ERROR', label: '위험' },
            ],
        },
        {
            key: 'eqId',
            label: '장비',
            options: eqOptions,
        },
        {
            key: 'acknowledged',
            label: '확인 여부',
            options: [
                { value: 'false', label: '미확인' },
                { value: 'true', label: '확인 완료' },
            ],
        },
    ]
})

const filteredAlerts = computed(() => {
    return alertStore.alertList.filter((alert) => {
        const matchLevel =
            !filterValues.value.level || alert.level === filterValues.value.level

        const matchEqId =
            !filterValues.value.eqId || alert.eqId === filterValues.value.eqId

        const matchAcknowledged =
            !filterValues.value.acknowledged ||
            String(alert.acknowledged) === filterValues.value.acknowledged

        return matchLevel && matchEqId && matchAcknowledged
    })
})

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