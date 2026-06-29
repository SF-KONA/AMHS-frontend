<template>
    <AppLayout>
        <div class="page-section">
            <div class="page-header">
                <h2 class="page-title">통계</h2>

                <div class="page-actions">
                    <button class="state-button" @click="setState('normal')">정상</button>
                    <button class="state-button" @click="setState('loading')">로딩</button>
                    <button class="state-button" @click="setState('empty')">빈 데이터</button>
                    <button class="state-button" @click="setState('error')">에러</button>

                    <ExportButton :loading="isExporting" @click="handleExport" />
                </div>
            </div>

            <RiskRankingChart
                :rows="displayRows"
                :loading="isLoading"
                :error="isError"
            />
        </div>
    </AppLayout>
</template>

<script setup>
import { computed, ref } from 'vue'
import AppLayout from '../../layouts/AppLayout.vue'
import RiskRankingChart from '../../components/stats/RiskRankingChart.vue'
import ExportButton from '../../components/stats/ExportButton.vue'

const isExporting = ref(false)
const currentState = ref('normal')

const baseRows = [
    { label: 'OHT-08', riskScore: 92 },
    { label: 'AGV-07', riskScore: 81 },
    { label: 'OHT-11', riskScore: 74 },
    { label: 'AGV-12', riskScore: 63 },
    { label: 'OHT-03', riskScore: 58 },
]

const isLoading = computed(() => currentState.value === 'loading')
const isError = computed(() => currentState.value === 'error')

const displayRows = computed(() => {
    if (currentState.value === 'empty') {
        return []
    }

    if (currentState.value === 'error' || currentState.value === 'loading') {
        return []
    }

    return baseRows
})

function setState(state) {
    currentState.value = state
}

function handleExport() {
    isExporting.value = true

    const rows = [
        ['장비', '위험도'],
        ...baseRows.map((row) => [row.label, row.riskScore]),
    ]

    const csvContent = rows.map((row) => row.join(',')).join('\n')
    const blob = new Blob(['\ufeff' + csvContent], {
        type: 'text/csv;charset=utf-8;',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'risk-ranking.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    isExporting.value = false
}
</script>

<style scoped>
.page-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
}

.page-title {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    color: var(--color-text);
}

.page-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.state-button {
    height: 36px;
    padding: 0 12px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-surface);
    color: var(--color-text);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
}
</style>