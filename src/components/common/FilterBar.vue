<template>
    <div class="filter-bar">
        <div
            v-for="filter in filters"
            :key="filter.key"
            class="filter-item"
        >
            <label class="filter-label">{{ filter.label }}</label>

            <select
                class="filter-select"
                :value="modelValue[filter.key] || ''"
                @change="handleChange(filter.key, $event.target.value)"
            >
                <option value="">전체</option>
                <option
                    v-for="option in filter.options"
                    :key="option.value"
                    :value="option.value"
                >
                    {{ option.label }}
                </option>
            </select>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    filters: {
        type: Array,
        default: () => [],
    },
    modelValue: {
        type: Object,
        default: () => ({}),
    },
})

const emit = defineEmits(['update:modelValue', 'change'])

function handleChange(key, value) {
    const nextValue = {
        ...props.modelValue,
        [key]: value,
    }

    emit('update:modelValue', nextValue)
    emit('change', nextValue)
}
</script>

<style scoped>
.filter-bar {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    padding: 16px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 12px;
}

.filter-item {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 160px;
}

.filter-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text-muted);
}

.filter-select {
    height: 40px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    padding: 0 12px;
    background: #fff;
    color: var(--color-text);
    font-size: 14px;
}
</style>