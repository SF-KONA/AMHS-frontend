<template>
    <button class="export-button" @click="handleExport" :disabled="loading">
        {{ loading ? '다운로드 중...' : '엑셀 다운로드' }}
    </button>
</template>

<script setup>
const props = defineProps({
    loading: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['click'])

function handleExport() {
    emit('click')
}
</script>

<style scoped>
.export-button {
    height: 40px;
    padding: 0 16px;
    border: none;
    border-radius: 8px;
    background: var(--color-text);
    color: #fff;
    font-weight: 700;
    cursor: pointer;
}

.export-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
</style>