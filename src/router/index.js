import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const routes = [
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('../views/dashboard/DashboardView.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/dashboard/:deviceId',
        name: 'equipment-detail',
        component: () => import('../views/equipment/EquipmentDetailView.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/equipment',
        name: 'equipment',
        component: () => import('../views/equipment/EquipmentListView.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/alerts',
        name: 'alerts',
        component: () => import('../views/alerts/AlertListView.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/maintenance',
        name: 'maintenance',
        component: () => import('../views/maintenance/MaintenanceListView.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/maintenance/new',
        name: 'maintenance-create',
        component: () => import('../views/maintenance/new/MaintenanceCreateView.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/maintenance/:id',
        name: 'maintenance-detail',
        component: () => import('../views/maintenance/MaintenanceDetailView.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/stats',
        name: 'stats',
        component: () => import('../views/stats/StatisticsView.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/auth/LoginView.vue'),
    },
    {
        path: '/admin/thresholds',
        name: 'thresholds',
        component: () => import('../views/admin/ThresholdView.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
        path: '/analysis/traceability',
        name: 'traceability',
        component: () => import('../views/analysis/TraceabilityView.vue'),
        meta: { requiresAuth: true, requiresAdmin: true },
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to) => {
    const authStore = useAuthStore()

    if (to.meta.requiresAuth && !authStore.isLoggedIn) {
        return '/login'
    }

    if (to.path === '/login' && authStore.isLoggedIn) {
        return '/dashboard'
    }

    if (to.meta.requiresAdmin && authStore.role !== 'ADMIN') {
        return '/dashboard'
    }   
})

export default router