<template>
  <div class="report-wrapper">
    <div class="container report-inner py-5">
      <header class="report-header">
        <div class="report-title-block">
          <p class="text-muted small fw-bold text-uppercase mb-2">Bedroom Planner</p>
          <h1 class="report-project-name">{{ store.projectName }}</h1>

          <div class="customer-details">
            <div>
              <p class="detail-label">Customer</p>
              <p class="customer-name">{{ store.clientName }}</p>
            </div>

            <div v-if="store.clientMobile.trim()" class="muted-detail">
              <span class="detail-label">Phone</span>
              <span>{{ store.clientMobile }}</span>
            </div>

            <div v-if="store.clientEmail.trim()" class="muted-detail">
              <span class="detail-label">Email</span>
              <span>{{ store.clientEmail }}</span>
            </div>

            <div v-if="store.clientAddress.trim()" class="muted-detail">
              <span class="detail-label">Address</span>
              <span>{{ store.clientAddress }}</span>
            </div>
          </div>
        </div>

        <div class="report-actions">
          <button
            type="button"
            class="btn btn-save"
            :disabled="saveIsDisabled"
            @click="store.saveProject"
          >
            <span
              v-if="store.save.loading"
              class="spinner-border spinner-border-sm me-2"
              aria-hidden="true"
            ></span>
            {{ saveButtonLabel }}
          </button>

          <button type="button" class="btn btn-back" @click="router.push('/planner')">
            Back to Planner
          </button>
        </div>
      </header>

      <div v-if="store.preview.data && store.preview.isStale" class="alert alert-warning mt-4">
        Planner inputs changed. Recalculate the estimate from the planner before using this report.
      </div>

      <div v-if="store.save.completed" class="alert alert-success mt-4">
        Project saved successfully.
      </div>

      <div v-if="store.save.error" class="alert alert-danger mt-4">
        {{ store.save.error }}
      </div>

      <EstimatePreview v-if="store.preview.data" :preview="store.preview.data" />

      <section v-else class="empty-report">
        <h2 class="h4 fw-bold mb-2">No estimate preview available</h2>
        <p class="text-muted mb-4">Generate an estimate from the planner to view the report.</p>
        <button type="button" class="btn btn-primary" @click="router.push('/planner')">
          Open Planner
        </button>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import EstimatePreview from '@/components/EstimatePreview.vue'
import { usePlannerStore } from '@/stores/Planner'

const router = useRouter()
const store = usePlannerStore()

const saveIsDisabled = computed(
  () =>
    !store.preview.data ||
    store.preview.isStale ||
    store.save.loading ||
    store.save.completed,
)

const saveButtonLabel = computed(() => {
  if (store.save.loading) return 'Saving...'
  if (store.save.completed) return 'Saved ✓'
  return 'Save Project'
})
</script>

<style scoped>
.report-wrapper {
  min-height: 100vh;
  background: transparent;
  color: #2c2c2c;
}

.report-inner {
  max-width: 1080px;
}

.report-header,
.empty-report {
  background: white;
  border: 1px solid rgba(20, 20, 20, 0.08);
  border-radius: 22px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(30, 40, 50, 0.05);
}

.report-header {
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

.customer-details {
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

.report-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-save {
  background: #c8a97e;
  color: white;
  border: none;
  border-radius: 14px;
  padding: 0.8rem 1.25rem;
  font-weight: 700;
}

.btn-save:hover:not(:disabled) {
  background: #a88b5a;
  color: white;
}

.btn-save:disabled {
  border: none;
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

.empty-report {
  margin-top: 1.5rem;
  text-align: center;
}

@media (max-width: 768px) {
  .report-header {
    flex-direction: column;
    align-items: stretch;
  }

  .report-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .report-project-name {
    font-size: 2.35rem;
  }
}
</style>
