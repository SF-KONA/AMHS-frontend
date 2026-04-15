<template>
    <AppLayout>
        <div class="page-section">
            <h2 class="page-title">임계값 설정</h2>

            <div class="page-card">
                <table class="threshold-table">
                    <thead>
                        <tr>
                            <th>센서</th>
                            <th>관심</th>
                            <th>경고</th>
                            <th>위험</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="row in thresholdRows" :key="row.sensor">
                            <td>{{ row.sensor }}</td>
                            <td><input v-model="row.idle" type="number" /></td>
                            <td><input v-model="row.warning" type="number" /></td>
                            <td><input v-model="row.error" type="number" /></td>
                        </tr>
                    </tbody>
                </table>

                <div class="action-row">
                    <button class="save-button">저장</button>
                </div>
            </div>
        </div>
    </AppLayout>
</template>

<script setup>
import { ref } from 'vue'
import AppLayout from '../../layouts/AppLayout.vue'

const thresholdRows = ref([
    { sensor: 'PM10', idle: 30, warning: 50, error: 80 },
    { sensor: 'NTC', idle: 40, warning: 55, error: 70 },
    { sensor: 'CT1', idle: 10, warning: 15, error: 20 },
    { sensor: 'IR_TEMP_MAX', idle: 50, warning: 65, error: 80 },
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

.threshold-table {
    width: 100%;
    border-collapse: collapse;
}

.threshold-table th,
.threshold-table td {
    padding: 12px;
    border-bottom: 1px solid var(--color-border);
    text-align: left;
}

.threshold-table input {
    width: 100%;
    height: 36px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 0 10px;
    box-sizing: border-box;
}

.action-row {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
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