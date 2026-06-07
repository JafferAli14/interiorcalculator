<template>
  <div class="planner-wrapper">
    <div class="container planner-inner py-5">
      <header class="text-center" :class="store.currentStep > 1 ? 'mb-5' : 'mb-4'">
        <h1 class="display-5 fw-bold mb-3">Bedroom Planner</h1>

        <div class="progress-container mx-auto" style="max-width: 760px">
          <div class="progress-tracker">
            <div class="tracker-inner">
              <div class="tracker-line-bg">
                <div class="tracker-line-fill" :style="{ width: progressLineWidth }"></div>
              </div>

              <div class="tracker-steps">
                <div
                  v-for="(step, index) in steps"
                  :key="step.label"
                  class="tracker-step"
                  :class="{
                    completed: index < store.currentStep - 1,
                    active: index === store.currentStep - 1,
                    upcoming: index >= store.currentStep,
                  }"
                >
                  <div class="tracker-node"></div>
                  <div class="tracker-label">{{ step.label }}</div>
                </div>
              </div>
            </div>

            <div class="tracker-counter">{{ store.currentStep }}/5</div>
          </div>
        </div>
      </header>

      <main class="content-shell">
        <transition name="page-fade" mode="out-in">
          <component :is="currentStepComponent" />
        </transition>
      </main>

      <footer class="nav-footer d-flex justify-content-between mt-5 pt-4">
        <button v-if="store.currentStep > 1" @click="store.prevStep" class="btn btn-back">
          <i class="bi bi-arrow-left"></i>
          Previous
        </button>

        <div v-else></div>

        <button @click="handleNext" class="btn btn-next" :disabled="!isStepValid">
          {{ store.currentStep === 5 ? 'Get Estimate' : 'Next Step' }}
          <i class="bi bi-arrow-right ms-2"></i>
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePlannerStore } from '@/stores/Planner'

import Design from '@/components/Design.vue'
import Ceilings from '@/components/Ceilings.vue'
import Walls from '@/components/Walls.vue'
import Flooring from '@/components/Flooring.vue'
import Furnishing from '@/components/Furnishing.vue'

const store = usePlannerStore()

const steps = [
  { label: 'Style' },
  { label: 'Ceiling' },
  { label: 'Walls' },
  { label: 'Flooring' },
  { label: 'Furnishing' },
]

const currentStepComponent = computed(() => {
  const stepComponents = [Design, Ceilings, Walls, Flooring, Furnishing]
  return stepComponents[store.currentStep - 1]
})

const progressLineWidth = computed(() => {
  const maxSteps = steps.length - 1
  return `${((store.currentStep - 1) / maxSteps) * 100}%`
})

const isStepValid = computed(() => {
  if (store.currentStep === 1) {
    return !!store.design.style
  }

  if (store.currentStep === 2) {
    const c = store.ceiling

    return (
      c.level !== null &&
      c.cornishSize !== null &&
      c.lightingType !== '' &&
      c.hasCurtainBox !== null
    )
  }

  if (store.currentStep === 3) {
    const w = store.walls

    return (
      w.curtainChoice !== '' &&
      w.manualArea !== null &&
      w.manualArea > 0 &&
      w.mouldingLength !== null &&
      w.mouldingLength > 0 &&
      w.wallPainting !== '' &&
      w.wallpaper !== ''
    )
  }

  if (store.currentStep === 4) {
    const f = store.flooring

    return (
      f.material !== '' &&
      f.manualArea !== null &&
      f.manualArea > 0 &&
      f.tileSize !== '' &&
      f.skirtingSize !== null &&
      f.hasParquet !== null &&
      f.hasGlassWork !== null
    )
  }

  return true
})

const handleNext = () => {
  if (!isStepValid.value) return

  if (store.currentStep === 5) {
    console.log('Generating estimate...', store.$state)
  } else {
    store.nextStep()
  }
}
</script>

<style scoped>
.planner-wrapper {
  min-height: 100vh;
  background: transparent;
  color: #2c2c2c;
}

.planner-inner {
  max-width: 1080px;
}

.progress-tracker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 0 0.5rem;
}

.tracker-inner {
  position: relative;
  flex: 1;
  min-width: 0;
}

.tracker-line-bg {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(128, 101, 206, 0.16);
  transform: translateY(-50%);
  border-radius: 999px;
  overflow: hidden;
}

.tracker-line-fill {
  height: 100%;
  width: 0;
  background: #5a2d8a;
  transition: width 0.35s ease;
}

.tracker-steps {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
}

.tracker-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-width: 0;
}

.tracker-node {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid rgba(90, 45, 138, 0.18);
  background: transparent;
  transition: all 0.25s ease;
  box-sizing: border-box;
}

.tracker-step.completed .tracker-node {
  border-color: #5a2d8a;
  background: #5a2d8a;
}

.tracker-step.active .tracker-node {
  width: 24px;
  height: 24px;
  border-width: 4px;
  border-color: #4f2774;
  background: rgba(95, 41, 139, 0.14);
  box-shadow: 0 0 0 3px rgba(79, 39, 116, 0.12);
}

.tracker-step.upcoming .tracker-node {
  border-color: rgba(90, 45, 138, 0.16);
  background: transparent;
  opacity: 0.75;
}

.tracker-label {
  margin-top: 0.75rem;
  font-size: 0.78rem;
  line-height: 1.4;
  letter-spacing: 0.02em;
  color: #6c6c78;
  white-space: nowrap;
}

.tracker-counter {
  flex-shrink: 0;
  color: #2c2c2c;
  font-weight: 700;
  font-size: 0.95rem;
  min-width: 3.5rem;
  text-align: right;
}

.content-shell {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.btn-next {
  background: #c8a97e;
  color: white;
  padding: 12px 40px;
  border-radius: 14px;
  font-weight: 600;
  border: none;
  box-shadow: 0 10px 20px rgba(200, 169, 126, 0.2);
  transition: all 0.3s ease;
}

.btn-next:hover:not(:disabled) {
  background: #a88b5a;
  transform: translateY(-2px);
}

.btn-next:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.btn-back {
  background: transparent;
  color: #6c757d;
  font-weight: 600;
  border: none;
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 575.98px) {
  .progress-tracker {
    flex-direction: column;
    align-items: stretch;
  }

  .tracker-counter {
    text-align: left;
    margin-top: 0.75rem;
  }
}
</style>