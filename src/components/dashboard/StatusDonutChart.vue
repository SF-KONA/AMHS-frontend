<template>
    <div :class="['status-donut', `status-donut-${size}`]">
        <v-chart class="chart" :option="option" autoresize />
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'

use([CanvasRenderer, PieChart, TooltipComponent, LegendComponent])

const props = defineProps({
    running: { type: Number, default: 0 },
    stopped: { type: Number, default: 0 },
    maintenance: { type: Number, default: 0 },
    size: {
        type: String,
        default: 'large',
        validator: (v) => ['large', 'mini'].includes(v),
    },
    centerTitle: { type: String, default: '' },
})

const COLORS = {
    running: '#059669', // var(--color-normal)
    stopped: '#dc2626', // var(--color-danger)
    maintenance: '#d97706', // var(--color-warning)
}

const total = computed(() => props.running + props.stopped + props.maintenance)

const option = computed(() => {
    const isMini = props.size === 'mini'
    const data = [
        { value: props.running, name: '가동', itemStyle: { color: COLORS.running } },
        { value: props.stopped, name: '정지', itemStyle: { color: COLORS.stopped } },
        { value: props.maintenance, name: '정비', itemStyle: { color: COLORS.maintenance } },
    ]

    return {
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c}대 ({d}%)',
        },
        legend: isMini
            ? { show: false }
            : {
                  bottom: 0,
                  itemWidth: 10,
                  itemHeight: 10,
                  textStyle: { fontSize: 12, color: '#5a6070' },
              },
        series: [
            {
                type: 'pie',
                radius: isMini ? ['55%', '85%'] : ['58%', '80%'],
                center: isMini ? ['50%', '50%'] : ['50%', '42%'],
                avoidLabelOverlap: false,
                label: isMini
                    ? {
                          show: true,
                          position: 'center',
                          formatter: `${total.value}`,
                          fontSize: 16,
                          fontWeight: 700,
                          color: '#1a1d23',
                      }
                    : {
                          show: true,
                          position: 'center',
                          formatter: props.centerTitle
                              ? `{title|${props.centerTitle}}\n{total|${total.value}}\n{label|총 장비}`
                              : `{total|${total.value}}\n{label|총 장비}`,
                          rich: {
                              title: {
                                  fontSize: 12,
                                  fontWeight: 700,
                                  color: '#2563eb',
                                  lineHeight: 18,
                              },
                              total: {
                                  fontSize: 28,
                                  fontWeight: 700,
                                  color: '#1a1d23',
                                  lineHeight: 32,
                              },
                              label: {
                                  fontSize: 11,
                                  color: '#5a6070',
                                  lineHeight: 16,
                              },
                          },
                      },
                labelLine: { show: false },
                emphasis: {
                    label: { show: true },
                    scale: true,
                    scaleSize: 4,
                },
                data,
            },
        ],
    }
})
</script>

<style scoped>
.status-donut {
    width: 100%;
    height: 100%;
}

.status-donut-large {
    min-height: 200px;
}

.status-donut-mini {
    min-height: 100px;
    width: 100px;
    height: 100px;
}

.chart {
    width: 100%;
    height: 100%;
}
</style>
