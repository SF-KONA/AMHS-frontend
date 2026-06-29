<template>
    <AppLayout>
        <div class="page-section">
            <h2 class="page-title">장비 목록</h2>

            <FilterBar
                v-model="filterValues"
                :filters="filters"
            />

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
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '../../layouts/AppLayout.vue'
import FilterBar from '../../components/common/FilterBar.vue'
import DataTable from '../../components/common/DataTable.vue'
import StatusBadge from '../../components/common/StatusBadge.vue'
import { useEquipmentStore } from '../../stores/equipmentStore'

const router = useRouter()
const store = useEquipmentStore()

const filterValues = ref({
    fabId: '',
    lineId: '',
    status: '',
})

const filters = computed(() => {
    const fabOptions = store.fabs.map((fab) => ({
        value: fab.fabId,
        label: fab.fabName,
    }))

    const lineMap = new Map()
    store.fabs.forEach((fab) => {
        fab.lines.forEach((line) => {
            lineMap.set(line.lineId, {
                value: line.lineId,
                label: line.lineName,
            })
        })
    })

    const lineOptions = Array.from(lineMap.values())

    return [
        { key: 'fabId', label: 'Fab', options: fabOptions },
        { key: 'lineId', label: 'Line', options: lineOptions },
        {
            key: 'status',
            label: '상태',
            options: [
                { value: 'RUNNING', label: '정상' },
                { value: 'STOPPED', label: '정지' },
                { value: 'MAINTENANCE', label: '정비' },
            ],
        },
    ]
})

const columns = [
    { key: 'deviceId', label: '장비코드' },
    { key: 'deviceType', label: '장비유형' },
    { key: 'lineId', label: '라인' },
    { key: 'status', label: '상태', slot: true },
]

const equipmentRows = computed(() => {
    return store.equipmentList.filter((eq) => {
        const matchFab =
            !filterValues.value.fabId || eq.fabId === filterValues.value.fabId
        const matchLine =
            !filterValues.value.lineId || eq.lineId === filterValues.value.lineId
        const matchStatus =
            !filterValues.value.status || eq.status === filterValues.value.status

        return matchFab && matchLine && matchStatus
    })
})

function handleRowClick(row) {
    router.push(`/dashboard/${row.deviceId}`)
}

onMounted(() => {
    if (!store.fabs.length) {
        store.fetchFabs()
    }

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
</style>