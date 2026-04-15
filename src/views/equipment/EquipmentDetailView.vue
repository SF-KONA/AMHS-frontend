<template>
    <AppLayout>
        <div class="detail-page">
            <h1 class="detail-title">장비 상세: {{ route.params.eqId }}</h1>
            <router-link to="/dashboard" class="back-link">
                ← 대시보드로 돌아가기
            </router-link>
        </div>
    </AppLayout>
</template>

<script setup>
import { useRoute } from 'vue-router'
import AppLayout from '../../layouts/AppLayout.vue'

const route = useRoute()
</script>

<style scoped>
.detail-page {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 24px;
}

.detail-title {
    margin: 0 0 16px;
    font-size: 24px;
    font-weight: 700;
    color: var(--color-text);
}

.back-link {
    color: var(--color-interest);
    text-decoration: none;
    font-weight: 600;
}

.back-link:hover {
    text-decoration: underline;
}
</style>