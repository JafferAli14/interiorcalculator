<template>
  <div class="dashboard-page">
    <div class="dashboard-header">
      <div>
        <h1>Interior Calculator</h1>
        <p>Admin Dashboard</p>
      </div>

      <button class="logout-btn" @click="logout">Logout</button>
    </div>

    <div class="dashboard-grid">
      <div class="dashboard-card" @click="goToPlanner">
        <h2>+ New Project</h2>
        <p>Create a new interior estimate</p>
      </div>

      <div class="dashboard-card" @click="goToProjects">
        <h2>Saved Projects</h2>
        <p>View previous project reports</p>
      </div>

      <div v-if="isSuperAdmin" class="dashboard-card" @click="goToPriceManagement">
        <h2>Price Management</h2>
        <p>Manage catalogue rates and active items</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const isSuperAdmin = computed(() => {
  const adminUser = localStorage.getItem('adminUser')
  const token = localStorage.getItem('adminToken')

  return hasSuperAdminRole(adminUser) || hasSuperAdminRoleFromToken(token)
})

const goToPlanner = () => {
  router.push('/planner')
}

const goToProjects = () => {
  router.push('/projects')
}

const goToPriceManagement = () => {
  router.push('/superadmin/price-items')
}

const logout = () => {
  localStorage.removeItem('adminToken')
  localStorage.removeItem('adminUser')
  router.push('/login')
}

function hasSuperAdminRole(rawUser: string | null): boolean {
  if (!rawUser) return false

  try {
    const data = JSON.parse(rawUser) as Record<string, unknown>
    return hasRole(data)
  } catch {
    return false
  }
}

function hasSuperAdminRoleFromToken(token: string | null): boolean {
  const payload = token?.split('.')[1]
  if (!payload) return false

  try {
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
    const data = JSON.parse(atob(padded)) as Record<string, unknown>
    return hasRole(data)
  } catch {
    return false
  }
}

function hasRole(data: Record<string, unknown>): boolean {
  if (data.isSuperAdmin === true) return true

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

  return roleKeys.some((key) => {
    const value = data[key]

    if (typeof value === 'string') return value.toLowerCase() === 'superadmin'
    if (Array.isArray(value)) {
      return value.some((item) => typeof item === 'string' && item.toLowerCase() === 'superadmin')
    }

    return false
  })
}
</script>

<style scoped>
.dashboard-page {
  min-height: 100vh;
  padding: 48px;
  background: #f7f3ed;
  color: #2c2c2c;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 50px;
}

.dashboard-header h1 {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 6px;
}

.dashboard-header p {
  color: #777;
  font-size: 18px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(260px, 1fr));
  gap: 28px;
  max-width: 900px;
}

.dashboard-card {
  background: white;
  border-radius: 22px;
  padding: 36px;
  cursor: pointer;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.08);
  transition: all 0.25s ease;
}

.dashboard-card:hover {
  transform: translateY(-4px);
}

.dashboard-card h2 {
  font-size: 28px;
  margin-bottom: 12px;
}

.dashboard-card p {
  color: #777;
}

.logout-btn {
  padding: 10px 22px;
  border: none;
  border-radius: 999px;
  background: #2c2c2c;
  color: white;
  font-weight: 600;
  cursor: pointer;
}
</style>
