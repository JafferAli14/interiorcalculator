<template>
  <div class="additional-step">
    <header class="step-header text-center mb-4">
      <h2 class="page-title mb-2 text-dark fw-bold">Additional Requirements</h2>

      <p class="text-muted fs-6 mb-0">
        Add any custom requirements not covered in previous sections. You can skip this step if not
        needed.
      </p>
    </header>

    <div class="inputs-stack">
      <section class="input-block mb-4">
        <h3 class="input-block-title h6 fw-bold mb-1">Additional Requirements</h3>

        <p class="text-muted small mb-3">Do you have any additional requirements?</p>

        <div class="option-grid two">
          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.additional.hasAdditional === true }"
            @click="store.additional.hasAdditional = true"
          >
            <span class="choice-icon">✓</span>
            <strong>Yes</strong>
            <small>I have additional requirements</small>
          </button>

          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.additional.hasAdditional === false }"
            @click="clearAdditionalAndSkip"
          >
            <span class="choice-icon">→</span>
            <strong>Skip</strong>
            <small>No additional requirements</small>
          </button>
        </div>
      </section>

      <template v-if="store.additional.hasAdditional === true">
        <section class="input-block mb-4">
          <h3 class="input-block-title h6 fw-bold mb-1">Additional Notes</h3>

          <textarea
            v-model="store.additional.notes"
            rows="5"
            class="form-control"
            placeholder="Example: Custom wardrobe lighting, decorative wall panel, extra storage unit, etc."
          />
        </section>

        <section class="input-block mb-4">
          <h3 class="input-block-title h6 fw-bold mb-1">Additional Price Adjustment</h3>

          <div class="input-group">
            <span class="input-group-text">QAR</span>

            <input
              v-model.number="store.additional.extraPrice"
              type="number"
              min="0"
              class="form-control"
              placeholder="Enter amount"
            />
          </div>
        </section>

        <section class="input-block">
          <h3 class="input-block-title h6 fw-bold mb-3">Sliding Price Adjustor</h3>

          <div class="price-display">QAR {{ formattedExtraPrice }}</div>

          <input
            v-model.number="store.additional.extraPrice"
            type="range"
            min="0"
            max="5000"
            step="100"
            class="form-range"
          />

          <div class="slider-labels">
            <span>QAR 0</span>
            <span>QAR 2,500</span>
            <span>QAR 5,000</span>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePlannerStore } from '@/stores/Planner'

const store = usePlannerStore()

const formattedExtraPrice = computed(() => {
  return Number(store.additional.extraPrice || 0).toLocaleString('en-IN')
})

function clearAdditionalAndSkip() {
  store.additional.hasAdditional = false
  store.additional.notes = ''
  store.additional.extraPrice = null
}
</script>

<style scoped>
.additional-step {
  width: 100%;
  max-width: 760px;
  margin-inline: auto;
}

.input-block {
  background: white;
  border: 1px solid rgba(20, 20, 20, 0.08);
  border-radius: 22px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(30, 40, 50, 0.04);
}

.option-grid {
  display: grid;
  gap: 1rem;
}

.option-grid.two {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.choice-card {
  min-height: 130px;
  border: 1px solid rgba(44, 44, 44, 0.1);
  background: white;
  border-radius: 18px;
  padding: 1.1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.25s ease;
}

.choice-card:hover {
  transform: translateY(-3px);
}

.choice-card.selected {
  border-color: #c9ae87;
  box-shadow:
    0 0 0 3px rgba(201, 174, 135, 0.24),
    0 12px 30px rgba(201, 174, 135, 0.16);
}

.choice-icon {
  width: 42px;
  height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(201, 174, 135, 0.14);
  color: #9c825b;
  font-size: 1rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
}

.price-display {
  font-size: 2rem;
  font-weight: 800;
  color: #9c825b;
  margin-bottom: 1rem;
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.slider-labels span {
  color: #888;
  font-weight: 600;
}

@media (max-width: 768px) {
  .option-grid.two {
    grid-template-columns: 1fr;
  }
}
</style>
