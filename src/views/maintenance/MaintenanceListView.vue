<template>
    <AppLayout>
        <div class="page-section">
            <h2 class="page-title">정비 오더 목록</h2>

            <div class="summary-cards">
                <div class="summary-card">
                    <div class="summary-label">Line 1</div>
                    <div class="summary-value">가동률 80%</div>
                    <div class="summary-sub">미처리 오더 2건</div>
                </div>
                <div class="summary-card">
                    <div class="summary-label">Line 2</div>
                    <div class="summary-value">가동률 70%</div>
                    <div class="summary-sub">미처리 오더 3건</div>
                </div>
                <div class="summary-card">
                    <div class="summary-label">Line 3</div>
                    <div class="summary-value">가동률 90%</div>
                    <div class="summary-sub">미처리 오더 1건</div>
                </div>
            </div>

            <FilterBar
                v-model="filterValues"
                :filters="filters"
            />

            <DataTable
                :columns="columns"
                :data="filteredRows"
                :loading="false"
                @row-click="handleRowClick"
            >
                <template #status="{ row }">
                    <StatusBadge :status="mapOrderStatus(row.status)" />
                </template>
            </DataTable>
        </div>
    </AppLayout>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '../../layouts/AppLayout.vue'
import FilterBar from '../../components/common/FilterBar.vue'
import DataTable from '../../components/common/DataTable.vue'
import StatusBadge from '../../components/common/StatusBadge.vue'

const router = useRouter()

const filterValues = ref({
    lineId: '',
    status: '',
})

const filters = [
    {
        key: 'lineId',
        label: 'Line',
        options: [
            { value: 'LINE-1', label: 'Line 1' },
            { value: 'LINE-2', label: 'Line 2' },
            { value: 'LINE-3', label: 'Line 3' },
            { value: 'LINE-4', label: 'Line 4' },
        ],
    },
    {
        key: 'status',
        label: '상태',
        options: [
            { value: 'OPEN', label: 'OPEN' },
            { value: 'ASSIGNED', label: 'ASSIGNED' },
            { value: 'IN_PROGRESS', label: 'IN_PROGRESS' },
            { value: 'COMPLETED', label: 'COMPLETED' },
        ],
    },
]

const columns = [
    { key: 'orderId', label: '오더번호' },
    { key: 'eqId', label: '장비' },
    { key: 'lineId', label: 'Line' },
    { key: 'priority', label: '우선순위' },
    { key: 'status', label: '상태', slot: true },
]

const rows = [
    {
        orderId: 'MO-001',
        eqId: 'OHT-03',
        lineId: 'LINE-1',
        priority: 'HIGH',
        status: 'OPEN',
    },
    {
        orderId: 'MO-002',
        eqId: 'OHT-11',
        lineId: 'LINE-2',
        priority: 'MEDIUM',
        status: 'ASSIGNED',
    },
    {
        orderId: 'MO-003',
        eqId: 'AGV-07',
        lineId: 'LINE-3',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
    },
    {
        orderId: 'MO-004',
        eqId: 'AGV-12',
        lineId: 'LINE-4',
        priority: 'LOW',
        status: 'COMPLETED',
    },
]

const filteredRows = computed(() => {
    return rows.filter((row) => {
        const matchLine =
            !filterValues.value.lineId || row.lineId === filterValues.value.lineId
        const matchStatus =
            !filterValues.value.status || row.status === filterValues.value.status

        return matchLine && matchStatus
    })
})

function handleRowClick(row) {
    router.push(`/maintenance/${row.orderId}`)
}

function mapOrderStatus(status) {
    const map = {
        OPEN: 'WARNING',
        ASSIGNED: 'IDLE',
        IN_PROGRESS: 'ERROR',
        COMPLETED: 'RUNNING',
    }

    return map[status] || 'IDLE'
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

.summary-cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
}

.summary-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 16px;
}

.summary-label {
    font-size: 13px;
    color: var(--color-text-muted);
    margin-bottom: 6px;
}

.summary-value {
    font-size: 20px;
    font-weight: 700;
    color: var(--color-text);
    margin-bottom: 4px;
}

.summary-sub {
    font-size: 13px;
    color: var(--color-text-muted);
}

@media (max-width: 900px) {
    .summary-cards {
        grid-template-columns: 1fr;
    }
}
</style>