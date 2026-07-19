<template>
  <div class="saved-report-wrapper">
    <div class="container saved-report-inner py-5">
      <header class="saved-report-header">
        <div v-if="project" class="report-title-block">
          <p class="text-muted small fw-bold text-uppercase mb-2">Saved Bedroom Project</p>
          <h1 class="report-project-name">{{ project.projectName }}</h1>

          <div class="project-details">
            <div>
              <p class="detail-label">Customer</p>
              <p class="customer-name">{{ project.customerName }}</p>
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
        </div>

        <div v-else>
          <p class="text-muted small fw-bold text-uppercase mb-2">Saved Bedroom Project</p>
          <h1 class="display-6 fw-bold mb-0">Project Report</h1>
        </div>

        <button type="button" class="btn btn-back" @click="router.push('/projects')">
          <i class="bi bi-arrow-left me-2"></i>
          Back to Saved Projects
        </button>
      </header>

      <section v-if="invalidProjectId" class="state-card text-center">
        <h2 class="h5 fw-bold mb-2">Invalid project id</h2>
        <p class="text-muted mb-0">Return to Saved Projects and choose a report to view.</p>
      </section>

      <section v-else-if="loading" class="state-card text-center">
        <div class="spinner-border text-secondary" role="status">
          <span class="visually-hidden">Loading saved project report...</span>
        </div>
        <p class="text-muted mb-0 mt-3">Loading saved project report...</p>
      </section>

      <section v-else-if="error" class="alert alert-danger report-alert">
        <div>
          <strong>Unable to load saved project report.</strong>
          <p class="mb-0 mt-1">{{ error }}</p>
        </div>
        <button type="button" class="btn btn-outline-danger" @click="fetchProject">Retry</button>
      </section>

      <EstimatePreview v-else-if="savedPreview" :preview="savedPreview" />

      <section v-else class="state-card text-center">
        <h2 class="h5 fw-bold mb-2">Saved report unavailable</h2>
        <p class="text-muted mb-0">This project does not include a saved estimate snapshot.</p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EstimatePreview from '@/components/EstimatePreview.vue'
import { getSavedProjectById } from '@/services/projectApi'
import type {
  BedroomPreviewResponse,
  SavedBedroomProjectDetailResponse,
} from '@/types/bedroomPlanner'

const route = useRoute()
const router = useRouter()

const project = ref<SavedBedroomProjectDetailResponse | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const projectId = computed(() => {
  const id = route.params.id
  return Array.isArray(id) ? id[0] : id
})

const invalidProjectId = computed(() => !projectId.value || projectId.value.trim() === '')

const savedPreview = computed<BedroomPreviewResponse | null>(() => {
  if (!project.value) return null

  return {
    schemaVersion: project.value.plannerRequest?.schemaVersion ?? 'saved-project',
    currency: project.value.currency || 'QAR',
    priceLines: project.value.priceLines,
    categorySubtotals: project.value.categorySubtotals,
    grandTotal: project.value.grandTotal,
    warnings: project.value.warnings ?? [],
  }
})

async function fetchProject() {
  if (invalidProjectId.value || !projectId.value) return

  loading.value = true
  error.value = null

  try {
    project.value = await getSavedProjectById(projectId.value)
  } catch (fetchError) {
    error.value =
      fetchError instanceof Error ? fetchError.message : 'Unable to load saved project report.'
  } finally {
    loading.value = false
  }
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
  fetchProject()
})
</script>

<style scoped>
.saved-report-wrapper {
  min-height: 100vh;
  background: transparent;
  color: #2c2c2c;
}

.saved-report-inner {
  max-width: 1080px;
}

.saved-report-header,
.state-card {
  background: white;
  border: 1px solid rgba(20, 20, 20, 0.08);
  border-radius: 22px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(30, 40, 50, 0.05);
}

.saved-report-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.report-title-block {
  min-width: 0;
}

.report-project-name {
  margin: 0;
  color: #202020;
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.08;
}

.project-details {
  display: grid;
  gap: 0.55rem;
  margin-top: 1rem;
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

.customer-name {
  margin: 0;
  color: #303030;
  font-size: 1.35rem;
  font-weight: 700;
  line-height: 1.25;
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

.report-alert {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1.5rem;
}

.state-card {
  margin-top: 1.5rem;
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
  .saved-report-header,
  .report-alert {
    flex-direction: column;
    align-items: stretch;
  }

  .report-project-name {
    font-size: 2.35rem;
  }
}
</style>
