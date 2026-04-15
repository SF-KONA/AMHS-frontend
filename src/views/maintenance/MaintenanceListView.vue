<template>
    <AppLayout>
        <div class="page-section">
            <h2 class="page-title">정비 오더 목록</h2>

            <div class="top-action-row">
                <router-link to="/maintenance/new" class="create-button">
                    정비 오더 생성
                </router-link>
            </div>

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
                    <span :class="['order-status-badge', getOrderStatusClass(row.status)]">
                        {{ getOrderStatusLabel(row.status) }}
                    </span>
                </template>
            </DataTable>
        </div>
    </AppLayout>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMaintenanceStore } from '../../stores/maintenanceStore'
import AppLayout from '../../layouts/AppLayout.vue'
import FilterBar from '../../components/common/FilterBar.vue'
import DataTable from '../../components/common/DataTable.vue'

const router = useRouter()

const maintenanceStore = useMaintenanceStore()


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


const filteredRows = computed(() => {
    return maintenanceStore.orderList.filter((row) => {
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

function getOrderStatusLabel(status) {
    const map = {
        OPEN: '대기',
        ASSIGNED: '배정',
        IN_PROGRESS: '진행중',
        COMPLETED: '완료',
    }

    return map[status] || status
}

function getOrderStatusClass(status) {
    const map = {
        OPEN: 'is-open',
        ASSIGNED: 'is-assigned',
        IN_PROGRESS: 'is-in-progress',
        COMPLETED: 'is-completed',
    }

    return map[status] || ''
}
</script>

<style scoped>

.top-action-row {
    display: flex;
    justify-content: flex-end;
}

.create-button {
    display: inline-flex;
    align-items: center;
    height: 40px;
    padding: 0 16px;
    border-radius: 8px;
    background: var(--color-text);
    color: #fff;
    text-decoration: none;
    font-weight: 700;
}

.order-status-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 72px;
    padding: 6px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    line-height: 1;
    border: 1px solid transparent;
}

.is-open {
    background: color-mix(in srgb, var(--color-warning) 12%, white);
    color: var(--color-warning);
    border-color: color-mix(in srgb, var(--color-warning) 30%, white);
}

.is-assigned {
    background: color-mix(in srgb, var(--color-interest) 12%, white);
    color: var(--color-interest);
    border-color: color-mix(in srgb, var(--color-interest) 30%, white);
}

.is-in-progress {
    background: color-mix(in srgb, var(--color-danger) 12%, white);
    color: var(--color-danger);
    border-color: color-mix(in srgb, var(--color-danger) 30%, white);
}

.is-completed {
    background: color-mix(in srgb, var(--color-normal) 12%, white);
    color: var(--color-normal);
    border-color: color-mix(in srgb, var(--color-normal) 30%, white);
}

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