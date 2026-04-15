<template>
    <AppLayout>
        <div class="page-section">
            <div class="page-header">
                <h2 class="page-title">통계</h2>
                <ExportButton :loading="isExporting" @click="handleExport" />
            </div>

            <RiskRankingChart
                :rows="riskRows"
                :loading="false"
                :error="false"
            />
        </div>
    </AppLayout>
</template>

<script setup>
import { ref } from 'vue'
import AppLayout from '../../layouts/AppLayout.vue'
import RiskRankingChart from '../../components/stats/RiskRankingChart.vue'
import ExportButton from '../../components/stats/ExportButton.vue'

const isExporting = ref(false)

const riskRows = ref([
    { label: 'OHT-08', riskScore: 92 },
    { label: 'AGV-07', riskScore: 81 },
    { label: 'OHT-11', riskScore: 74 },
    { label: 'AGV-12', riskScore: 63 },
    { label: 'OHT-03', riskScore: 58 },
])

function handleExport() {
    isExporting.value = true

    const rows = [
        ['장비', '위험도'],
        ...riskRows.value.map((row) => [row.label, row.riskScore]),
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
}

.page-title {
    margin: 0;
    font-size: 24px;
    font-weight: 700;
    color: var(--color-text);
}
</style>