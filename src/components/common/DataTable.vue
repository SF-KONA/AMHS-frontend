<template>
    <div class="data-table-wrapper">
        <div v-if="loading" class="data-table-state">
            로딩 중...
        </div>

        <div v-else-if="!data || data.length === 0" class="data-table-state">
            데이터가 없습니다.
        </div>

        <table v-else class="data-table">
            <thead>
                <tr>
                    <th
                        v-for="column in columns"
                        :key="column.key"
                        class="data-table__head"
                    >
                        {{ column.label }}
                    </th>
                </tr>
            </thead>

            <tbody>
                <tr
                    v-for="(row, rowIndex) in paginatedData"
                    :key="row.id || row.deviceId || rowIndex"
                    class="data-table__row"
                    @click="handleRowClick(row)"
                >
                    <td
                        v-for="column in columns"
                        :key="column.key"
                        class="data-table__cell"
                    >
                        <slot
                            v-if="column.slot"
                            :name="column.key"
                            :row="row"
                            :value="row[column.key]"
                        />
                        <template v-else>
                            {{ row[column.key] }}
                        </template>
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-if="showPagination && totalPages > 1" class="pagination">
            <button
                class="pagination__button"
                :disabled="currentPage === 1"
                @click="goToPrevPage"
            >
                이전
            </button>

            <span class="pagination__info">
                {{ currentPage }} / {{ totalPages }}
            </span>

            <button
                class="pagination__button"
                :disabled="currentPage === totalPages"
                @click="goToNextPage"
            >
                다음
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
    columns: {
        type: Array,
        required: true,
    },
    data: {
        type: Array,
        default: () => [],
    },
    loading: {
        type: Boolean,
        default: false,
    },
    pageSize: {
        type: Number,
        default: 10,
    },
    showPagination: {
        type: Boolean,
        default: true,
    },
})

const emit = defineEmits(['row-click'])

const currentPage = ref(1)

const totalPages = computed(() => {
    return Math.max(1, Math.ceil(props.data.length / props.pageSize))
})

const paginatedData = computed(() => {
    const startIndex = (currentPage.value - 1) * props.pageSize
    const endIndex = startIndex + props.pageSize
    return props.data.slice(startIndex, endIndex)
})

function handleRowClick(row) {
    emit('row-click', row)
}

function goToPrevPage() {
    if (currentPage.value > 1) {
        currentPage.value -= 1
    }
}

function goToNextPage() {
    if (currentPage.value < totalPages.value) {
        currentPage.value += 1
    }
}

watch(
    () => props.data,
    () => {
        currentPage.value = 1
    },
    { deep: true }
)
</script>

<style scoped>
.data-table-wrapper {
    width: 100%;
}

.data-table {
    width: 100%;
    border-collapse: collapse;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    overflow: hidden;
}

.data-table__head {
    padding: 14px 16px;
    text-align: left;
    font-size: 13px;
    font-weight: 700;
    color: var(--color-text);
    background: var(--color-bg);
    border-bottom: 1px solid var(--color-border);
}

.data-table__cell {
    padding: 14px 16px;
    font-size: 14px;
    color: var(--color-text);
    border-bottom: 1px solid var(--color-border);
}

.data-table__row {
    cursor: pointer;
    transition: background-color 0.2s;
}

.data-table__row:hover {
    background: var(--color-bg);
}

.data-table-state {
    padding: 32px 16px;
    text-align: center;
    color: var(--color-text-muted);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 12px;
}

.pagination {
    margin-top: 16px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
}

.pagination__button {
    padding: 8px 12px;
    border: 1px solid var(--color-border);
    background: var(--color-surface);
    border-radius: 8px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
}

.pagination__button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

.pagination__info {
    font-size: 13px;
    color: var(--color-text-muted);
}
</style>