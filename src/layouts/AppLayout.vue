<template>
    <div class="app-layout">
        <aside class="sidebar">
            <div class="sidebar__logo">AMHS</div>

            <nav class="sidebar__nav">
                <RouterLink to="/dashboard" class="nav-item" active-class="is-active">대시보드</RouterLink>
                <RouterLink to="/equipment" class="nav-item" active-class="is-active">장비 목록</RouterLink>
                <RouterLink to="/alerts" class="nav-item" active-class="is-active">알림 이력</RouterLink>
                <RouterLink to="/maintenance" class="nav-item" active-class="is-active">정비 목록</RouterLink>
                <RouterLink to="/stats" class="nav-item" active-class="is-active">통계</RouterLink>
                <RouterLink to="/login" class="nav-item" active-class="is-active">로그인</RouterLink>
            </nav>
        </aside>

        <div class="layout-main">
            <header class="layout-header">
                <h1 class="layout-title">{{ pageTitle }}</h1>
                <div class="layout-header__right">FE2 Layout</div>
            </header>

            <main class="layout-content">
                <slot />
            </main>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

const route = useRoute()

const titleMap = {
    dashboard: '대시보드',
    equipment: '장비 목록',
    alerts: '알림 이력',
    maintenance: '정비 목록',
    stats: '통계',
    login: '로그인',
    'equipment-detail': '장비 상세',
}

const pageTitle = computed(() => {
    return titleMap[route.name] || 'AMHS Frontend'
})
</script>

<style scoped>
.app-layout {
    min-height: 100vh;
    display: flex;
    background: var(--color-bg);
    color: var(--color-text);
}

.sidebar {
    width: 240px;
    flex-shrink: 0;
    background: var(--color-surface);
    border-right: 1px solid var(--color-border);
    padding: 24px 16px;
}

.sidebar__logo {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 24px;
}

.sidebar__nav {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.nav-item {
    display: block;
    padding: 12px 14px;
    border-radius: 10px;
    color: var(--color-text-muted);
    text-decoration: none;
    font-size: 14px;
    font-weight: 600;
    transition: background-color 0.2s, color 0.2s;
}

.nav-item:hover {
    background: var(--color-bg);
    color: var(--color-text);
}

.nav-item.is-active {
    background: var(--color-text);
    color: #ffffff;
}

.layout-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
}

.layout-header {
    height: 72px;
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.layout-title {
    font-size: 20px;
    font-weight: 700;
    margin: 0;
}

.layout-header__right {
    font-size: 13px;
    color: var(--color-text-muted);
}

.layout-content {
    flex: 1;
    padding: 24px;
}

@media (max-width: 900px) {
    .sidebar {
        width: 200px;
    }

    .layout-content {
        padding: 16px;
    }
}
</style>