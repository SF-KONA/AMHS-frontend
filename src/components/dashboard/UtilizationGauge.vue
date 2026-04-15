<template>
    <div class="utilization-gauge">
        <v-chart class="chart" :option="option" autoresize />
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { GaugeChart } from 'echarts/charts'
import { TooltipComponent } from 'echarts/components'
import VChart from 'vue-echarts'

use([CanvasRenderer, GaugeChart, TooltipComponent])

const props = defineProps({
    running: { type: Number, default: 0 },
    totalSlots: { type: Number, default: 10 },
    minRunning: { type: Number, default: 7 },
})

const NORMAL_COLOR = '#059669' // var(--color-normal)
const DANGER_COLOR = '#dc2626' // var(--color-danger)

const percent = computed(() => {
    if (!props.totalSlots) return 0
    return Math.round((props.running / props.totalSlots) * 100)
})

const isUnderMin = computed(() => props.running < props.minRunning)

const option = computed(() => {
    const color = isUnderMin.value ? DANGER_COLOR : NORMAL_COLOR

    return {
        series: [
            {
                type: 'gauge',
                startAngle: 210,
                endAngle: -30,
                min: 0,
                max: 100,
                radius: '95%',
                center: ['50%', '58%'],
                progress: {
                    show: true,
                    width: 12,
                    itemStyle: { color },
                },
                axisLine: {
                    lineStyle: {
                        width: 12,
                        color: [[1, '#e2e5ea']],
                    },
                },
                pointer: { show: false },
                axisTick: { show: false },
                splitLine: { show: false },
                axisLabel: { show: false },
                anchor: { show: false },
                title: {
                    offsetCenter: [0, '52%'],
                    fontSize: 10,
                    color: isUnderMin.value ? DANGER_COLOR : '#5a6070',
                    fontWeight: 600,
                },
                detail: {
                    valueAnimation: true,
                    offsetCenter: [0, '-8%'],
                    formatter: () => `{val|${percent.value}%}\n{ratio|${props.running}/${props.totalSlots}}`,
                    rich: {
                        val: {
                            fontSize: 20,
                            fontWeight: 700,
                            color: '#1a1d23',
                            lineHeight: 22,
                        },
                        ratio: {
                            fontSize: 10,
                            color: '#5a6070',
                            lineHeight: 14,
                        },
                    },
                },
                data: [
                    {
                        value: percent.value,
                        name: isUnderMin.value ? '가용 부족' : '가동률',
                    },
                ],
            },
        ],
    }
})
</script>

<style scoped>
.utilization-gauge {
    width: 130px;
    height: 130px;
}

.chart {
    width: 100%;
    height: 100%;
}
</style>
