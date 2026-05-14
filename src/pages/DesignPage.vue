<template>
  <div class="planner-wrapper">
    <div class="container planner-inner py-5">
      <!-- 1. HEADER & PROGRESS -->
      <header class="text-center" :class="store.currentStep > 1 ? 'mb-5' : 'mb-4'">
        <h1 class="display-5 fw-bold mb-3">Bedroom Planner</h1>
        <div
          v-if="store.currentStep > 1"
          class="progress-container mx-auto"
          style="max-width: 600px"
        >
          <div
            class="d-flex justify-content-between mb-2 small fw-bold text-uppercase tracking-wider"
          >
            <span>Step {{ store.currentStep }} of 5</span>
            <span>{{ Math.round(store.progressPercentage) }}%</span>
          </div>
          <div class="progress custom-progress">
            <div class="progress-bar" :style="{ width: store.progressPercentage + '%' }"></div>
          </div>
        </div>
      </header>

      <!-- 2. THE CONTENT AREA (Where steps appear) -->
      <main class="content-shell">
        <transition name="page-fade" mode="out-in">
          <!-- This dynamically loads Step1Design, Step2Ceiling, etc. -->
          <component :is="currentStepComponent" />
        </transition>
      </main>

      <!-- 3. NAVIGATION FOOTER -->
      <footer class="nav-footer d-flex justify-content-between mt-5 pt-4">
        <button v-if="store.currentStep > 1" @click="store.prevStep" class="btn btn-back">
          <i class="bi bi-arrow-left"></i> Previous
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
import { usePlannerStore } from '@/stores/planner'

// Import all your step components
import Design from '@/components/Design.vue'
import Ceilings from '@/components/Ceilings.vue'
import Walls from '@/components/Walls.vue'
import Flooring from '@/components/Flooring.vue'
import Furnishing from '@/components/Furnishing.vue'

const store = usePlannerStore()

// Mapping the currentStep number to the actual Component
const currentStepComponent = computed(() => {
  const steps = [Design, Ceilings, Walls, Flooring, Furnishing]
  return steps[store.currentStep - 1]
})

// Validation: Don't let them proceed if they haven't picked a style yet
const isStepValid = computed(() => {
  if (store.currentStep === 1) return !!store.design.style
  return true
})

const handleNext = () => {
  if (store.currentStep === 5) {
    // Final logic here (e.g., submit to organization)
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

/* Centered reading width; Bootstrap .container already caps width per breakpoint */
.planner-inner {
  max-width: 1080px;
}

.custom-progress {
  height: 8px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 10px;
  overflow: hidden;
}

.progress-bar {
  background: linear-gradient(90deg, #a88b5a, #c8a97e);
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.content-shell {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

/* Button Styling */
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

.btn-back {
  background: transparent;
  color: #6c757d;
  font-weight: 600;
  border: none;
}

/* Step Transitions */
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
</style>
