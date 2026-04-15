<template>
    <AppLayout>
        <div class="page-section">
            <h2 class="page-title">정비 오더 생성</h2>

            <div class="form-card">
                <div class="form-group">
                    <label>장비 ID</label>
                    <input v-model="form.eqId" type="text" placeholder="예: OHT-03" />
                </div>

                <div class="form-group">
                    <label>Line</label>
                    <select v-model="form.lineId">
                        <option value="">선택하세요</option>
                        <option value="LINE-1">LINE-1</option>
                        <option value="LINE-2">LINE-2</option>
                        <option value="LINE-3">LINE-3</option>
                        <option value="LINE-4">LINE-4</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>우선순위</label>
                    <select v-model="form.priority">
                        <option value="">선택하세요</option>
                        <option value="HIGH">HIGH</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="LOW">LOW</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>관련 알림 ID</label>
                    <input v-model="form.alertId" type="text" placeholder="선택 입력" />
                </div>

                <div class="form-group">
                    <label>설명</label>
                    <textarea
                        v-model="form.description"
                        placeholder="정비 요청 내용을 입력하세요."
                    />
                </div>

                <p v-if="errorMessage" class="error-message">
                    {{ errorMessage }}
                </p>

                <div class="action-row">
                    <router-link to="/maintenance" class="cancel-link">
                        취소
                    </router-link>

                    <button class="save-button" @click="handleCreate">
                        생성
                    </button>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppLayout from '../../../layouts/AppLayout.vue'
import { useMaintenanceStore } from '../../../stores/maintenanceStore'

const router = useRouter()
const route = useRoute()
const maintenanceStore = useMaintenanceStore()

const errorMessage = ref('')

const form = reactive({
    eqId: '',
    lineId: '',
    priority: '',
    alertId: route.query.alertId || '',
    description: '',
})

function handleCreate() {
    errorMessage.value = ''

    if (!form.eqId || !form.lineId || !form.priority) {
        errorMessage.value = '장비 ID, Line, 우선순위는 필수입니다.'
        return
    }

    const nextNumber = maintenanceStore.orderList.length + 1
    const orderId = `MO-${String(nextNumber).padStart(3, '0')}`

    maintenanceStore.addOrder({
        orderId,
        eqId: form.eqId,
        lineId: form.lineId,
        priority: form.priority,
        status: 'OPEN',
        actionMemo: form.description,
        alertId: form.alertId,
    })

    router.push('/maintenance')
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

.form-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group label {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text);
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 10px 12px;
    font-size: 14px;
    box-sizing: border-box;
}

.form-group textarea {
    min-height: 120px;
    resize: vertical;
}

.error-message {
    margin: 0;
    font-size: 13px;
    color: var(--color-danger);
}

.action-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
}

.cancel-link {
    color: var(--color-text-muted);
    text-decoration: none;
    font-weight: 600;
}

.save-button {
    height: 40px;
    padding: 0 16px;
    border: none;
    border-radius: 8px;
    background: var(--color-text);
    color: #fff;
    font-weight: 700;
    cursor: pointer;
}
</style>