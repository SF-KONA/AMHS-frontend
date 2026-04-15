<template>
    <div class="tab-section">
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
        </DataTable>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import DataTable from '../../components/common/DataTable.vue'
import StatusBadge from '../../components/common/StatusBadge.vue'
import { useAlertStore } from '../../stores/alertStore'

const props = defineProps({
    eqId: {
        type: String,
        required: true,
    },
})

const alertStore = useAlertStore()

const columns = [
    { key: 'createdAt', label: '시각' },
    { key: 'eqId', label: '장비' },
    { key: 'level', label: '등급', slot: true },
    { key: 'sensorName', label: '센서' },
    { key: 'sensorValue', label: '값' },
    { key: 'acknowledged', label: '확인 여부', slot: true },
]

const filteredAlerts = computed(() => {
    return alertStore.alertList.filter((alert) => alert.eqId === props.eqId)
})

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
.tab-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.ack-text {
    font-size: 13px;
    font-weight: 600;
    color: var(--color-danger);
}

.ack-text.done {
    color: var(--color-normal);
}
</style>