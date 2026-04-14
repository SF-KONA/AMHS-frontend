<template>
    <AppLayout>
        <div class="page-card">
            <h1>장비 목록 페이지</h1>
        </div>
    </AppLayout>
</template>

<script setup>
import AppLayout from '../../layouts/AppLayout.vue'
</script>

<style scoped>
.page-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 24px;
}
</style>