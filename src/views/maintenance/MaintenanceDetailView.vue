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
            </div>

            <div class="status-section">
                <h3 class="section-title">상태 전이</h3>
                <div class="status-buttons">
                    <button class="status-button">OPEN</button>
                    <button class="status-button">ASSIGNED</button>
                    <button class="status-button">IN_PROGRESS</button>
                    <button class="status-button">COMPLETED</button>
                </div>
            </div>

            <div class="detail-card">
                <h3 class="section-title">조치 내용</h3>
                <textarea
                    class="action-textarea"
                    placeholder="조치 내용을 입력하세요."
                />
            </div>
        </div>
    </AppLayout>
</template>

<script setup>
import { useRoute } from 'vue-router'
import AppLayout from '../../layouts/AppLayout.vue'

const route = useRoute()
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
</style>