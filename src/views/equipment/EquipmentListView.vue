<template>
    <AppLayout>
        <div class="page-card">
            <h2 class="page-title">장비 목록</h2>

            <div class="equipment-list">
                <div
                    v-for="eq in equipmentList"
                    :key="eq.eqId"
                    class="equipment-item"
                >
                    <div class="equipment-info">
                        <div class="equipment-id">{{ eq.eqId }}</div>
                        <div class="equipment-meta">
                            <span>{{ eq.eqType }}</span>
                            <span>{{ eq.lineId }}</span>
                        </div>
                    </div>

                    <StatusBadge :status="eq.status" />
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import AppLayout from '../../layouts/AppLayout.vue'
import StatusBadge from '../../components/common/StatusBadge.vue'
import { useEquipmentStore } from '../../stores/equipmentStore'

const store = useEquipmentStore()

const equipmentList = computed(() => store.equipmentList)

onMounted(() => {
    if (!store.equipmentList.length) {
        store.fetchEquipment()
    }
})
</script>

<style scoped>
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