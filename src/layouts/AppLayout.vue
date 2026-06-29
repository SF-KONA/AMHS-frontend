<template>
    <div class="app-layout">
        <aside class="sidebar">
            <div class="sidebar__logo">AMHS</div>

            <nav class="sidebar__nav">
                <div class="nav-section">
                    <p class="nav-section__title">메인 메뉴</p>

                    <RouterLink to="/dashboard" class="nav-item" active-class="is-active">대시보드</RouterLink>
                    <RouterLink to="/equipment" class="nav-item" active-class="is-active">장비 목록</RouterLink>

                    <RouterLink to="/alerts" class="nav-item nav-item--with-badge" active-class="is-active">
                        <span>알림 이력</span>
                        <span v-if="unreadAlertCount > 0" class="nav-badge">
                            {{ unreadAlertCount }}
                        </span>
                    </RouterLink>

                    <RouterLink to="/maintenance" class="nav-item" active-class="is-active">정비 목록</RouterLink>
                    <RouterLink to="/stats" class="nav-item" active-class="is-active">통계</RouterLink>
                </div>

                <div v-if="isAdmin" class="nav-section nav-section--admin">
                    <p class="nav-section__title">관리자 기능</p>

                    <RouterLink
                        to="/admin/thresholds"
                        class="nav-item"
                        active-class="is-active"
                    >
                        임계값 설정
                    </RouterLink>

                    <RouterLink
                        to="/analysis/traceability"
                        class="nav-item"
                        active-class="is-active"
                    >
                        장비 추적 분석
                    </RouterLink>
                </div>

                <div v-if="!isLoggedIn" class="nav-section">
                    <p class="nav-section__title">계정</p>
                    <RouterLink to="/login" class="nav-item" active-class="is-active">
                        로그인
                    </RouterLink>
                </div>
            </nav>
        </aside>

        <div class="layout-main">
            <header class="layout-header">
                <h1 class="layout-title">{{ pageTitle }}</h1>
                <div class="layout-header__right">
                    <template v-if="isLoggedIn">
                        <span class="user-name">{{ userName }}</span>
                        <button class="logout-button" @click="handleLogout">
                            로그아웃
                        </button>
                    </template>

                    <template v-else>
                        <RouterLink to="/login" class="login-link">로그인</RouterLink>
                    </template>
                </div>
            </header>

            <main class="layout-content">
                <slot />
            </main>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useAlertStore } from '../stores/alertStore'
import { useAuthStore } from '../stores/authStore'

const route = useRoute()
const router = useRouter()
const alertStore = useAlertStore()
const authStore = useAuthStore()

const unreadCount = computed(() => alertStore.unreadCount)
const unreadAlertCount = computed(() => alertStore.unreadCount)
const isAdmin = computed(() => authStore.role === 'ADMIN')
const isLoggedIn = computed(() => authStore.isLoggedIn)
const userName = computed(() => authStore.user?.name || '게스트')

const titleMap = {
    dashboard: '대시보드',
    equipment: '장비 목록',
    alerts: '알림 이력',
    maintenance: '정비 목록',
    stats: '통계',
    login: '로그인',
    'equipment-detail': '장비 상세',
    'maintenance-detail': '정비 상세',
    thresholds: '임계값 설정',
    traceability: '장비 추적 분석',
}

const pageTitle = computed(() => {
    return titleMap[route.name] || 'AMHS Frontend'
})

function handleLogout() {
    authStore.logout()
    router.push('/login')
}
</script>

<style scoped>

.nav-section {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.nav-section + .nav-section {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid var(--color-border);
}

.nav-section__title {
    margin: 0 0 4px;
    padding: 0 6px;
    font-size: 12px;
    font-weight: 700;
    color: var(--color-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.nav-section--admin .nav-section__title {
    color: var(--color-danger);
}

.user-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text);
}

.logout-button {
    margin-left: 10px;
    height: 32px;
    padding: 0 12px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-surface);
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: var(--color-text);
}

.login-link {
    color: var(--color-interest);
    text-decoration: none;
    font-size: 13px;
    font-weight: 600;
}

.nav-item--with-badge {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
}

.nav-badge {
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    border-radius: 999px;
    background: var(--color-danger);
    color: #ffffff;
    font-size: 11px;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

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