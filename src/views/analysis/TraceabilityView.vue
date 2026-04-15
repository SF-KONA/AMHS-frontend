<template>
    <AppLayout>
        <div class="page-section">
            <h2 class="page-title">장비 추적 분석</h2>

            <div class="page-card">
                <div class="filter-row">
                    <label>분석 기준</label>
                    <select v-model="groupBy">
                        <option value="manufacturer">제조사별</option>
                        <option value="installer">설치작업자별</option>
                        <option value="installDate">설치기간별</option>
                        <option value="line">Line별</option>
                    </select>
                </div>

                <div class="mock-chart">
                    <p>선택 기준: {{ groupBy }}</p>
                    <p>여기에 그룹별 위험 비율 차트가 들어갈 예정</p>
                </div>

                <table class="trace-table">
                    <thead>
                        <tr>
                            <th>그룹</th>
                            <th>위험 비율</th>
                            <th>장비 수</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in rows" :key="row.group">
                            <td>{{ row.group }}</td>
                            <td>{{ row.riskRate }}</td>
                            <td>{{ row.count }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </AppLayout>
</template>

<script setup>
import { ref } from 'vue'
import AppLayout from '../../layouts/AppLayout.vue'

const groupBy = ref('manufacturer')

const rows = ref([
    { group: 'A사', riskRate: '32%', count: 8 },
    { group: 'B사', riskRate: '18%', count: 12 },
    { group: 'C사', riskRate: '25%', count: 20 },
])
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
    padding: 20px;
}

.filter-row {
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-width: 280px;
    margin-bottom: 20px;
}

.filter-row select {
    height: 40px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 0 10px;
}

.mock-chart {
    margin-bottom: 20px;
    padding: 20px;
    border: 1px dashed var(--color-border);
    border-radius: 12px;
    background: var(--color-bg);
    color: var(--color-text-muted);
}

.trace-table {
    width: 100%;
    border-collapse: collapse;
}

.trace-table th,
.trace-table td {
    padding: 12px;
    border-bottom: 1px solid var(--color-border);
    text-align: left;
}
</style>