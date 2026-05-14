<template>
  <div class="step-content mx-auto" style="max-width: 640px">
    <h2 class="section-title text-center mb-2">Ceiling &amp; lighting</h2>
    <p class="text-center text-muted small mb-4">
      Configure ceiling options here. (Additional fields can go in this step.)
    </p>

    <div
      v-if="store.design.style === 'Modern'"
      class="modern-extra-panel animate-in"
    >
      <div class="info-box">
        <h3 class="h6 fw-bold mb-2">Modern specification</h3>
        <p class="small text-muted mb-3">
          Modern designs often include a &quot;pop up&quot; architectural area. Please specify the
          size if applicable.
        </p>
        <div class="row">
          <div class="col-md-6">
            <label class="form-label small fw-bold">Pop up area (sq.ft)</label>
            <input
              type="number"
              v-model.number="store.design.manualPopUpArea"
              class="form-control"
              placeholder="0"
              min="0"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlannerStore } from '@/stores/planner'

const store = usePlannerStore()
</script>

<style scoped>
.section-title {
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #2c2c2c;
}

.modern-extra-panel {
  width: 100%;
}

.info-box {
  background: rgba(126, 184, 220, 0.08);
  border-left: 4px solid #7eb8dc;
  padding: 20px;
  border-radius: 0 16px 16px 0;
}

.animate-in {
  animation: slideUp 0.4s ease-out forwards;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
