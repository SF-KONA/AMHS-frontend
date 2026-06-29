<template>
    <div class="chart-card">
        <div class="chart-header">
            <h3 class="chart-title">위험도 랭킹</h3>
        </div>

        <div v-if="loading" class="chart-state">
            로딩 중...
        </div>

        <div v-else-if="error" class="chart-state">
            데이터를 불러오지 못했습니다.
        </div>

        <div v-else-if="!chartRows.length" class="chart-state">
            데이터가 없습니다.
        </div>

        <VChart
            v-else
            class="chart"
            :option="chartOption"
            autoresize
        />
    </div>
</template>

<script setup>
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import {
    GridComponent,
    TooltipComponent,
    TitleComponent,
} from 'echarts/components'

use([
    CanvasRenderer,
    BarChart,
    GridComponent,
    TooltipComponent,
    TitleComponent,
])

const props = defineProps({
    rows: {
        type: Array,
        default: () => [],
    },
    loading: {
        type: Boolean,
        default: false,
    },
    error: {
        type: Boolean,
        default: false,
    },
})

const chartRows = computed(() => {
    return [...props.rows].sort((a, b) => b.riskScore - a.riskScore)
})

const chartOption = computed(() => {
    return {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
        },
        grid: {
            left: 100,
            right: 24,
            top: 20,
            bottom: 20,
        },
        xAxis: {
            type: 'value',
            max: 100,
            axisLabel: {
                formatter: '{value}',
            },
        },
        yAxis: {
            type: 'category',
            data: chartRows.value.map((row) => row.label),
        },
        series: [
            {
                type: 'bar',
                data: chartRows.value.map((row) => row.riskScore),
                barWidth: 18,
            },
        ],
    }
})
</script>

<style scoped>
.chart-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 20px;
}

.chart-header {
    margin-bottom: 12px;
}

.chart-title {
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: var(--color-text);
}

.chart {
    height: 320px;
    width: 100%;
}

.chart-state {
    min-height: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-muted);
    font-size: 14px;
}
</style>