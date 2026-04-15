<template>
    <AppLayout>
        <div class="page-section">
            <h2 class="page-title">정비 오더 상세</h2>

            <div class="detail-card">
                <div class="detail-row">
                    <span class="detail-label">오더번호</span>
                    <span class="detail-value">{{ route.params.id }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">장비</span>
                    <span class="detail-value">OHT-03</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">라인</span>
                    <span class="detail-value">LINE-1</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">우선순위</span>
                    <span class="detail-value">HIGH</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">현재 상태</span>
                    <span :class="['order-status-badge', getOrderStatusClass(currentStatus)]">
                        {{ getOrderStatusLabel(currentStatus) }}
                    </span>
                </div>
            </div>

            <div class="status-section">
                <h3 class="section-title">상태 전이</h3>

                <div class="status-buttons">
                    <button
                        v-for="status in statusFlow"
                        :key="status"
                        :class="['status-button', { active: currentStatus === status }]"
                        @click="changeStatus(status)"
                    >
                        {{ getOrderStatusLabel(status) }}
                    </button>
                </div>
            </div>

            <div class="detail-card">
                <h3 class="section-title">조치 내용</h3>

                <textarea
                    v-model="actionMemo"
                    class="action-textarea"
                    placeholder="조치 내용을 입력하세요."
                />

                <div class="memo-footer">
                    <span class="memo-guide">
                        {{ currentStatus === 'COMPLETED' ? '완료 처리 전 조치 내용을 꼭 확인하세요.' : '작업 진행 중 메모를 기록할 수 있습니다.' }}
                    </span>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '../../layouts/AppLayout.vue'

const route = useRoute()

const statusFlow = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED']
const currentStatus = ref('OPEN')
const actionMemo = ref('')

function changeStatus(status) {
    currentStatus.value = status
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

.section-title {
    margin: 0 0 12px;
    font-size: 18px;
    font-weight: 700;
    color: var(--color-text);
}

.detail-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 20px;
}

.detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid var(--color-border);
}

.detail-row:last-child {
    border-bottom: none;
}

.detail-label {
    font-size: 14px;
    color: var(--color-text-muted);
}

.detail-value {
    font-size: 14px;
    font-weight: 600;
    color: var(--color-text);
}

.status-section {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 20px;
}

.status-buttons {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.status-button {
    padding: 10px 14px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-bg);
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text);
    transition: all 0.2s ease;
}

.status-button:hover {
    border-color: var(--color-text-muted);
}

.status-button.active {
    background: var(--color-text);
    color: #ffffff;
    border-color: var(--color-text);
}

.action-textarea {
    width: 100%;
    min-height: 120px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 12px;
    font-size: 14px;
    resize: vertical;
    box-sizing: border-box;
}

.memo-footer {
    margin-top: 10px;
}

.memo-guide {
    font-size: 13px;
    color: var(--color-text-muted);
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
</style>