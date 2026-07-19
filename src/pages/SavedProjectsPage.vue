<template>
  <div class="projects-page">
    <div class="container projects-inner py-5">
      <header class="projects-header">
        <div>
          <p class="text-muted small fw-bold text-uppercase mb-2">Bedroom Planner</p>
          <h1 class="display-6 fw-bold mb-0">Saved Projects</h1>
        </div>

        <button type="button" class="btn btn-back" @click="router.push('/dashboard')">
          <i class="bi bi-arrow-left me-2"></i>
          Back
        </button>
      </header>

      <section v-if="loading" class="state-card text-center">
        <div class="spinner-border text-secondary" role="status">
          <span class="visually-hidden">Loading saved projects...</span>
        </div>
        <p class="text-muted mb-0 mt-3">Loading saved projects...</p>
      </section>

      <section v-else-if="error" class="alert alert-danger projects-alert">
        <div>
          <strong>Unable to load saved projects.</strong>
          <p class="mb-0 mt-1">{{ error }}</p>
        </div>
        <button type="button" class="btn btn-outline-danger" @click="fetchProjects">Retry</button>
      </section>

      <section v-else-if="projects.length === 0" class="state-card text-center">
        <h2 class="h5 fw-bold mb-2">No saved projects yet.</h2>
        <p class="text-muted mb-0">Saved bedroom estimates will appear here.</p>
      </section>

      <section v-else class="projects-grid">
        <article v-for="project in projects" :key="project.id" class="project-card">
          <div class="project-card-main">
            <div>
              <p class="text-muted small fw-bold text-uppercase mb-2">Project</p>
              <h2 class="project-title">{{ project.projectName }}</h2>
            </div>

            <p class="project-total">{{ formatCurrency(project.grandTotal, project.currency) }}</p>
          </div>

          <div class="project-details">
            <div>
              <p class="detail-label">Customer</p>
              <p class="detail-value strong">{{ project.customerName }}</p>
            </div>

            <div v-if="project.customerPhone" class="muted-detail">
              <span class="detail-label">Phone</span>
              <span>{{ project.customerPhone }}</span>
            </div>

            <div v-if="project.customerEmail" class="muted-detail">
              <span class="detail-label">Email</span>
              <span>{{ project.customerEmail }}</span>
            </div>

            <div v-if="project.customerAddress" class="muted-detail">
              <span class="detail-label">Address</span>
              <span>{{ project.customerAddress }}</span>
            </div>

            <div class="muted-detail">
              <span class="detail-label">Created</span>
              <span>{{ formatDate(project.createdAt) }}</span>
            </div>
          </div>

          <div class="project-actions">
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="router.push(`/projects/${project.id}`)"
            >
              View Report
            </button>
            <button type="button" class="btn btn-outline-secondary" disabled>Duplicate</button>
          </div>
        </article>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getSavedProjects } from '@/services/projectApi'
import type { SavedBedroomProjectListItem } from '@/types/bedroomPlanner'

const router = useRouter()
const projects = ref<SavedBedroomProjectListItem[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

async function fetchProjects() {
  loading.value = true
  error.value = null

  try {
    projects.value = await getSavedProjects()
  } catch (fetchError) {
    error.value = fetchError instanceof Error ? fetchError.message : 'Unable to load saved projects.'
  } finally {
    loading.value = false
  }
}

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat('en-QA', {
    style: 'currency',
    currency: currency || 'QAR',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('en-QA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

onMounted(() => {
  fetchProjects()
})
</script>

<style scoped>
.projects-page {
  min-height: 100vh;
  background: transparent;
  color: #2c2c2c;
}

.projects-inner {
  max-width: 1080px;
}

.projects-header,
.state-card,
.project-card {
  background: white;
  border: 1px solid rgba(20, 20, 20, 0.08);
  border-radius: 22px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(30, 40, 50, 0.05);
}

.projects-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.projects-alert {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.5rem;
}

.projects-grid {
  display: grid;
  gap: 1rem;
}

.project-card {
  display: grid;
  gap: 1.25rem;
}

.project-card-main {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.project-title {
  margin: 0;
  color: #202020;
  font-size: 1.6rem;
  font-weight: 800;
  line-height: 1.15;
}

.project-total {
  margin: 0;
  color: #2c2c2c;
  font-size: 1.25rem;
  font-weight: 800;
  white-space: nowrap;
}

.project-details {
  display: grid;
  gap: 0.55rem;
}

.detail-label {
  display: block;
  margin: 0 0 0.15rem;
  color: #8a8178;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.detail-value {
  margin: 0;
  color: #303030;
}

.detail-value.strong {
  font-size: 1.1rem;
  font-weight: 700;
}

.muted-detail {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 0.75rem;
  color: #6c757d;
  font-size: 0.95rem;
}

.muted-detail .detail-label {
  margin: 0;
  min-width: 4.5rem;
}

.project-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.btn-back {
  background: #2c2c2c;
  color: white;
  border: none;
  border-radius: 14px;
  padding: 0.8rem 1.25rem;
  font-weight: 700;
}

.btn-back:hover {
  background: #000;
  color: white;
}

@media (max-width: 768px) {
  .projects-header,
  .projects-alert,
  .project-card-main {
    flex-direction: column;
    align-items: stretch;
  }

  .project-total {
    white-space: normal;
  }

  .project-actions .btn {
    width: 100%;
  }
}
</style>
