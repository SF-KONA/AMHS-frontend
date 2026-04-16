<template>
    <div class="sensor-chart-tab">
        <div class="chart-grid">
            <div v-for="cfg in CHART_CONFIGS" :key="cfg.key" class="chart-card">
                <div class="chart-header">
                    <span class="chart-title">{{ cfg.label }}</span>
                    <span class="chart-unit">{{ cfg.unit }}</span>
                    <span class="chart-current" :style="{ color: currentColor(cfg.key) }">
                        {{ currentValue(cfg.key) }}
                    </span>
                </div>
                <v-chart
                    class="chart"
                    :option="chartOption(cfg)"
                    autoresize
                />
            </div>
        </div>
        <p class="chart-note">
            ※ mock 데이터 기반 1.5초 간격 슬라이딩 윈도우(60포인트). 실제 데이터는 WebSocket 연결 후 교체.
        </p>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
    GridComponent,
    TooltipComponent,
    MarkAreaComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'
import {
    SENSOR_THRESHOLDS,
    generateInitialReadings,
    generateNextReading,
} from '../../mocks/sensorReading'

use([
    CanvasRenderer,
    LineChart,
    GridComponent,
    TooltipComponent,
    MarkAreaComponent,
])

const props = defineProps({
    deviceId: {
        type: String,
        required: true,
    },
})

const WINDOW_SIZE = 60
const TICK_MS = 1500

const COLORS = {
    normal: '#059669',
    interest: '#2563eb',
    warning: '#d97706',
    danger: '#dc2626',
}

const CHART_CONFIGS = [
    { key: 'pm10', label: 'PM10', unit: 'µg/m³', precision: 1 },
    { key: 'ntc', label: 'NTC 온도', unit: '℃', precision: 1 },
    { key: 'ct1', label: 'CT1 전류', unit: 'A', precision: 2 },
    { key: 'irTempMax', label: 'IR 최고온도', unit: '℃', precision: 1 },
]

const readings = ref([])
let timer = null

function pushNext() {
    const prev = readings.value[readings.value.length - 1]
    const next = generateNextReading(prev)
    readings.value.push(next)
    if (readings.value.length > WINDOW_SIZE) {
        readings.value.shift()
    }
}

onMounted(() => {
    readings.value = generateInitialReadings(WINDOW_SIZE, TICK_MS)
    timer = setInterval(pushNext, TICK_MS)
})

onUnmounted(() => {
    if (timer) {
        clearInterval(timer)
        timer = null
    }
})

function currentValue(key) {
    if (readings.value.length === 0) return '-'
    const last = readings.value[readings.value.length - 1]
    const cfg = CHART_CONFIGS.find((c) => c.key === key)
    return last[key].toFixed(cfg ? cfg.precision : 1)
}

function levelOf(key, value) {
    const t = SENSOR_THRESHOLDS[key]
    if (value >= t.danger) return 'danger'
    if (value >= t.warning) return 'warning'
    if (value >= t.interest) return 'interest'
    return 'normal'
}

function currentColor(key) {
    if (readings.value.length === 0) return COLORS.normal
    const last = readings.value[readings.value.length - 1]
    return COLORS[levelOf(key, last[key])]
}

function buildMarkArea(key) {
    const t = SENSOR_THRESHOLDS[key]
    return {
        silent: true,
        data: [
            [
                { yAxis: 0, itemStyle: { color: 'rgba(5, 150, 105, 0.08)' } },
                { yAxis: t.interest },
            ],
            [
                { yAxis: t.interest, itemStyle: { color: 'rgba(37, 99, 235, 0.10)' } },
                { yAxis: t.warning },
            ],
            [
                { yAxis: t.warning, itemStyle: { color: 'rgba(217, 119, 6, 0.14)' } },
                { yAxis: t.danger },
            ],
            [
                { yAxis: t.danger, itemStyle: { color: 'rgba(220, 38, 38, 0.16)' } },
                { yAxis: t.max },
            ],
        ],
    }
}

function chartOption(cfg) {
    const t = SENSOR_THRESHOLDS[cfg.key]
    const color = currentColor(cfg.key)
    return {
        grid: { left: 44, right: 16, top: 16, bottom: 28 },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'line' },
            formatter: (params) => {
                if (!params || !params.length) return ''
                const p = params[0]
                const value = Number(p.value).toFixed(cfg.precision)
                return `${p.axisValueLabel}<br/>${cfg.label}: <b>${value}</b> ${cfg.unit}`
            },
        },
        xAxis: {
            type: 'category',
            data: readings.value.map((r) => r.collectedAt),
            boundaryGap: false,
            axisLabel: {
                color: '#5a6070',
                fontSize: 10,
                interval: Math.max(0, Math.floor(WINDOW_SIZE / 6) - 1),
            },
            axisLine: { lineStyle: { color: '#e2e5ea' } },
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: t.max,
            axisLabel: { color: '#5a6070', fontSize: 10 },
            splitLine: { lineStyle: { color: '#f0f1f4' } },
        },
        series: [
            {
                type: 'line',
                smooth: true,
                showSymbol: false,
                sampling: 'lttb',
                data: readings.value.map((r) => r[cfg.key]),
                lineStyle: { width: 2, color },
                itemStyle: { color },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: hexToRgba(color, 0.25) },
                            { offset: 1, color: hexToRgba(color, 0.02) },
                        ],
                    },
                },
                markArea: buildMarkArea(cfg.key),
            },
        ],
    }
}

function hexToRgba(hex, alpha) {
    const h = hex.replace('#', '')
    const r = parseInt(h.substring(0, 2), 16)
    const g = parseInt(h.substring(2, 4), 16)
    const b = parseInt(h.substring(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// deviceId가 바뀌면 (다른 장비 상세로 이동) mock 윈도우 리셋
watch(
    () => props.deviceId,
    () => {
        readings.value = generateInitialReadings(WINDOW_SIZE, TICK_MS)
    },
)
</script>

<style scoped>
.sensor-chart-tab {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.chart-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
}

.chart-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 10px;
    padding: 12px 14px 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.chart-header {
    display: flex;
    align-items: baseline;
    gap: 8px;
}

.chart-title {
    font-size: 13px;
    font-weight: 700;
    color: var(--color-text);
}

.chart-unit {
    font-size: 11px;
    color: var(--color-text-muted);
}

.chart-current {
    margin-left: auto;
    font-size: 18px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
}

.chart {
    width: 100%;
    height: 200px;
}

.chart-note {
    margin: 0;
    font-size: 11px;
    color: var(--color-text-muted);
}

@media (max-width: 900px) {
    .chart-grid {
        grid-template-columns: 1fr;
    }
}
</style>
