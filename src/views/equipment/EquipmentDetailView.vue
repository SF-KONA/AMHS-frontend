<template>
    <AppLayout>
        <div class="page-section">
            <h2 class="page-title">장비 상세</h2>

            <div class="detail-card">
                <div class="detail-row">
                    <span class="detail-label">장비 ID</span>
                    <span class="detail-value">{{ route.params.eqId }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">장비 유형</span>
                    <span class="detail-value">OHT</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">소속 Line</span>
                    <span class="detail-value">LINE-1</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">현재 상태</span>
                    <span class="detail-value">RUNNING</span>
                </div>
            </div>

            <div class="tab-card">
                <div class="tab-header">
                    <button
                        :class="['tab-button', { active: activeTab === 'sensor' }]"
                        @click="activeTab = 'sensor'"
                    >
                        센서 차트
                    </button>
                    <button
                        :class="['tab-button', { active: activeTab === 'alert-history' }]"
                        @click="activeTab = 'alert-history'"
                    >
                        알림 히스토리
                    </button>
                </div>

                <div class="tab-body">
                    <SensorChartTab
                        v-if="activeTab === 'sensor'"
                        :eq-id="route.params.eqId"
                    />

                    <AlertHistoryTab
                        v-else-if="activeTab === 'alert-history'"
                        :eq-id="route.params.eqId"
                    />
                </div>
            </div>

            <router-link to="/dashboard" class="back-link">
                ← 대시보드로 돌아가기
            </router-link>
        </div>
    </AppLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '../../layouts/AppLayout.vue'
import AlertHistoryTab from './AlertHistoryTab.vue'
import SensorChartTab from './SensorChartTab.vue'

const route = useRoute()
const activeTab = ref('sensor')
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

.detail-card,
.tab-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 20px;
}

.detail-row {
    display: flex;
    justify-content: space-between;
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

.tab-header {
    display: flex;
    gap: 10px;
    margin-bottom: 16px;
    border-bottom: 1px solid var(--color-border);
    padding-bottom: 12px;
}

.tab-button {
    padding: 10px 14px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-bg);
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text);
}

.tab-button.active {
    background: var(--color-text);
    color: #ffffff;
    border-color: var(--color-text);
}

.tab-body {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.placeholder-box {
    min-height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed var(--color-border);
    border-radius: 12px;
    background: var(--color-bg);
    color: var(--color-text-muted);
    font-size: 14px;
}

.back-link {
    color: var(--color-interest);
    text-decoration: none;
    font-weight: 600;
}

.back-link:hover {
    text-decoration: underline;
}
</style>