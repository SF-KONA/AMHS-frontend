<template>
    <AppLayout>
        <div class="page-section">
            <h2 class="page-title">장비 목록</h2>

            <DataTable
                :columns="columns"
                :data="equipmentRows"
                :loading="false"
                @row-click="handleRowClick"
            >
                <template #status="{ row }">
                    <StatusBadge :status="row.status" />
                </template>
            </DataTable>
        </div>
    </AppLayout>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '../../layouts/AppLayout.vue'
import DataTable from '../../components/common/DataTable.vue'
import StatusBadge from '../../components/common/StatusBadge.vue'
import { useEquipmentStore } from '../../stores/equipmentStore'

const router = useRouter()
const store = useEquipmentStore()

const columns = [
    { key: 'eqId', label: '장비코드' },
    { key: 'eqType', label: '장비유형' },
    { key: 'lineId', label: '라인' },
    { key: 'status', label: '상태', slot: true },
]

const equipmentRows = computed(() => store.equipmentList)

function handleRowClick(row) {
    router.push(`/dashboard/${row.eqId}`)
}

onMounted(() => {
    if (!store.equipmentList.length) {
        store.fetchEquipment()
    }
})
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

.page-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 24px;
}

.page-title {
    margin: 0 0 20px;
    font-size: 24px;
    font-weight: 700;
    color: var(--color-text);
}

.equipment-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.equipment-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: 10px;
    padding: 16px;
}

.equipment-info {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.equipment-id {
    font-size: 15px;
    font-weight: 700;
    color: var(--color-text);
}

.equipment-meta {
    display: flex;
    gap: 10px;
    font-size: 13px;
    color: var(--color-text-muted);
}
</style>