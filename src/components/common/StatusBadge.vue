<template>
    <span class="status-badge" :class="badgeClass">
        {{ label }}
    </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    status: {
        type: String,
        required: true,
    },
})

const normalizedStatus = computed(() => {
    return String(props.status).toUpperCase()
})

const badgeClass = computed(() => {
    const classMap = {
        RUNNING: 'is-running',
        IDLE: 'is-idle',
        WARNING: 'is-warning',
        ERROR: 'is-error',
    }

    return classMap[normalizedStatus.value] || 'is-default'
})

const label = computed(() => {
    const labelMap = {
        RUNNING: '정상',
        IDLE: '관심',
        WARNING: '경고',
        ERROR: '위험',
    }

    return labelMap[normalizedStatus.value] || normalizedStatus.value
})
</script>

<style scoped>
.status-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 68px;
    padding: 6px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    line-height: 1;
    border: 1px solid transparent;
}

.is-running {
    background: color-mix(in srgb, var(--color-normal) 12%, white);
    color: var(--color-normal);
    border-color: color-mix(in srgb, var(--color-normal) 30%, white);
}

.is-idle {
    background: color-mix(in srgb, var(--color-interest) 12%, white);
    color: var(--color-interest);
    border-color: color-mix(in srgb, var(--color-interest) 30%, white);
}

.is-warning {
    background: color-mix(in srgb, var(--color-warning) 12%, white);
    color: var(--color-warning);
    border-color: color-mix(in srgb, var(--color-warning) 30%, white);
}

.is-error {
    background: color-mix(in srgb, var(--color-danger) 12%, white);
    color: var(--color-danger);
    border-color: color-mix(in srgb, var(--color-danger) 30%, white);
}

.is-default {
    background: var(--color-bg);
    color: var(--color-text-muted);
    border-color: var(--color-border);
}
</style>