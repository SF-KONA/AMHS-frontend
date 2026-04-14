import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        redirect: '/dashboard',
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('../views/dashboard/DashboardView.vue'),
    },
    {
        path: '/equipment',
        name: 'equipment',
        component: () => import('../views/equipment/EquipmentListView.vue'),
    },
    {
        path: '/alerts',
        name: 'alerts',
        component: () => import('../views/alerts/AlertListView.vue'),
    },
    {
        path: '/maintenance',
        name: 'maintenance',
        component: () => import('../views/maintenance/MaintenanceListView.vue'),
    },
    {
        path: '/stats',
        name: 'stats',
        component: () => import('../views/stats/StatisticsView.vue'),
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/auth/LoginView.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router