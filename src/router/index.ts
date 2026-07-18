import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/pages/LoginPage.vue'
import DashboardPage from '@/pages/DashboardPage.vue'
import DesignPage from '@/pages/DesignPage.vue'

function decodeBase64Url(value: string): string {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
  return atob(padded)
}

function hasSuperAdminRole(source: unknown): boolean {
  if (!source || typeof source !== 'object') return false

  const data = source as Record<string, unknown>
  const roleKeys = [
    'role',
    'roles',
    'userRole',
    'adminRole',
    'type',
    'userType',
    'adminType',
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
  ]

  if (data.isSuperAdmin === true) return true

  return roleKeys.some((key) => {
    const value = data[key]

    if (typeof value === 'string') return value.toLowerCase() === 'superadmin'
    if (Array.isArray(value)) {
      return value.some((item) => typeof item === 'string' && item.toLowerCase() === 'superadmin')
    }

    return false
  })
}

function isSuperAdmin(): boolean {
  const adminUser = localStorage.getItem('adminUser')

  if (adminUser) {
    try {
      if (hasSuperAdminRole(JSON.parse(adminUser))) return true
    } catch {
      localStorage.removeItem('adminUser')
    }
  }

  const token = localStorage.getItem('adminToken')
  const payload = token?.split('.')[1]

  if (!payload) return false

  try {
    return hasSuperAdminRole(JSON.parse(decodeBase64Url(payload)))
  } catch {
    return false
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
    },
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/planner',
      name: 'planner',
      component: DesignPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/estimate-report',
      name: 'estimate-report',
      component: () => import('@/pages/EstimateReportPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/projects',
      name: 'projects',
      component: () => import('@/pages/SavedProjectsPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/superadmin/price-items',
      name: 'superadmin-price-items',
      component: () => import('@/pages/SuperAdminPriceManagementPage.vue'),
      meta: { requiresAuth: true, requiresSuperAdmin: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('adminToken')

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.meta.requiresSuperAdmin && !isSuperAdmin()) {
    next('/dashboard')
  } else if (to.path === '/login' && token) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
