<template>
  <div class="furnishing-step">
    <header class="step-header text-center mb-4">
      <h2 class="page-title mb-2 text-dark fw-bold">Room Furnishing</h2>
      <p class="text-muted fs-6 mb-0">
        Select bed setup and furniture options for the bedroom.
      </p>
    </header>

    <div class="inputs-stack">
      <!-- 1. Bed Size -->
      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">1. Bed Size</h3>
        <p class="text-muted small mb-3">Choose the bed size.</p>

        <div class="option-grid two">
          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.furnishing.bedSize === 'King' }"
            @click="store.furnishing.bedSize = 'King'"
          >
            <span class="choice-icon">K</span>
            <strong>King Size</strong>
            <small>Larger premium bed setup</small>
          </button>

          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.furnishing.bedSize === 'Queen' }"
            @click="store.furnishing.bedSize = 'Queen'"
          >
            <span class="choice-icon">Q</span>
            <strong>Queen Size</strong>
            <small>Compact comfortable bed setup</small>
          </button>
        </div>
      </section>

      <!-- 2. Bed Setup -->
      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">2. Bed Setup</h3>
        <p class="text-muted small mb-3">Select required bed additions.</p>

        <div class="option-grid three">
          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.furnishing.hasHeadboard }"
            @click="store.furnishing.hasHeadboard = !store.furnishing.hasHeadboard"
          >
            <span class="choice-icon">HB</span>
            <strong>Headboard</strong>
            <small>Tap to select/deselect</small>
          </button>

          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.furnishing.hasBedsideCladding }"
            @click="store.furnishing.hasBedsideCladding = !store.furnishing.hasBedsideCladding"
          >
            <span class="choice-icon">BC</span>
            <strong>Bedside Cladding</strong>
            <small>Tap to select/deselect</small>
          </button>

          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.furnishing.hasDuvet }"
            @click="store.furnishing.hasDuvet = !store.furnishing.hasDuvet"
          >
            <span class="choice-icon">D</span>
            <strong>Duvet</strong>
            <small>Tap to select/deselect</small>
          </button>
        </div>
      </section>

      <!-- 3. Side Table -->
      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">3. Side Table</h3>
        <p class="text-muted small mb-3">Select side table option.</p>

        <div class="option-grid one">
          <button
            type="button"
            class="choice-card selected"
          >
            <span class="choice-icon">1</span>
            <strong>Choice 1</strong>
            <small>Default side table option</small>
          </button>
        </div>
      </section>

      <!-- 4. Side Lamps -->
      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">4. Side Lamps</h3>
        <p class="text-muted small mb-3">Do you need side lamps?</p>

        <div class="option-grid two">
          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.furnishing.hasSideLamps === true }"
            @click="store.furnishing.hasSideLamps = true"
          >
            <span class="choice-icon">✓</span>
            <strong>Yes</strong>
            <small>Add side lamps</small>
          </button>

          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.furnishing.hasSideLamps === false }"
            @click="store.furnishing.hasSideLamps = false"
          >
            <span class="choice-icon">×</span>
            <strong>No</strong>
            <small>No side lamps</small>
          </button>
        </div>
      </section>

      <!-- 5. TV Unit -->
      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">5. TV Unit</h3>
        <p class="text-muted small mb-3">Select TV unit option.</p>

        <div class="option-grid one">
          <button
            type="button"
            class="choice-card selected"
          >
            <span class="choice-icon">1</span>
            <strong>Choice 1</strong>
            <small>Default TV unit option</small>
          </button>
        </div>
      </section>

      <!-- 6. Chairs -->
      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">6. Chairs</h3>
        <p class="text-muted small mb-3">Do you need chairs?</p>

        <div class="option-grid two mb-4">
          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.furnishing.chairs.exists === true }"
            @click="store.furnishing.chairs.exists = true"
          >
            <span class="choice-icon">✓</span>
            <strong>Yes</strong>
            <small>Add chairs</small>
          </button>

          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.furnishing.chairs.exists === false }"
            @click="store.furnishing.chairs.exists = false; store.furnishing.chairs.count = 0"
          >
            <span class="choice-icon">×</span>
            <strong>No</strong>
            <small>No chairs</small>
          </button>
        </div>

        <div v-if="store.furnishing.chairs.exists" class="row">
          <div class="col-12 col-md-9 col-lg-7">
            <label class="form-label small fw-bold text-muted mb-2">Number of Chairs</label>
            <input
              v-model.number="store.furnishing.chairs.count"
              type="number"
              class="form-control form-control-lg rounded-3 shadow-sm"
              placeholder="Ex: 2"
              min="1"
            />
          </div>
        </div>
      </section>

      <!-- 7. Stools -->
      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">7. Stools</h3>
        <p class="text-muted small mb-3">Do you need stools?</p>

        <div class="option-grid two mb-4">
          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.furnishing.stools.exists === true }"
            @click="store.furnishing.stools.exists = true"
          >
            <span class="choice-icon">✓</span>
            <strong>Yes</strong>
            <small>Add stools</small>
          </button>

          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.furnishing.stools.exists === false }"
            @click="store.furnishing.stools.exists = false; store.furnishing.stools.count = 0"
          >
            <span class="choice-icon">×</span>
            <strong>No</strong>
            <small>No stools</small>
          </button>
        </div>

        <div v-if="store.furnishing.stools.exists" class="row">
          <div class="col-12 col-md-9 col-lg-7">
            <label class="form-label small fw-bold text-muted mb-2">Number of Stools</label>
            <input
              v-model.number="store.furnishing.stools.count"
              type="number"
              class="form-control form-control-lg rounded-3 shadow-sm"
              placeholder="Ex: 2"
              min="1"
            />
          </div>
        </div>
      </section>

      <!-- 8. Other Furniture -->
      <section class="input-block">
        <h3 class="input-block-title h6 fw-bold mb-1">8. Other Furniture</h3>
        <p class="text-muted small mb-3">Select additional furniture items.</p>

        <div class="option-grid two">
          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.furnishing.coffeeTable }"
            @click="store.furnishing.coffeeTable = !store.furnishing.coffeeTable"
          >
            <span class="choice-icon">CT</span>
            <strong>Coffee Table</strong>
            <small>Tap to select/deselect</small>
          </button>

          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.furnishing.console }"
            @click="store.furnishing.console = !store.furnishing.console"
          >
            <span class="choice-icon">C</span>
            <strong>Console</strong>
            <small>Tap to select/deselect</small>
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlannerStore } from '@/stores/Planner'

const store = usePlannerStore()
</script>

<style scoped>
.furnishing-step {
  width: 100%;
  max-width: 760px;
  margin-inline: auto;
}

.input-block {
  background: #ffffff;
  border: 1px solid rgba(20, 20, 20, 0.08);
  border-radius: 22px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(30, 40, 50, 0.04);
}

.input-block-title {
  font-size: 1.1rem;
}

.option-grid {
  display: grid;
  gap: 1rem;
}

.option-grid.one {
  grid-template-columns: 1fr;
}

.option-grid.two {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.option-grid.three {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.choice-card {
  min-height: 130px;
  border: 1px solid rgba(44, 44, 44, 0.1);
  background: #ffffff;
  border-radius: 18px;
  padding: 1.1rem;
  text-align: center;
  cursor: pointer;
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.choice-card:hover {
  transform: translateY(-3px);
  border-color: rgba(201, 174, 135, 0.6);
  box-shadow: 0 14px 30px rgba(30, 40, 50, 0.08);
}

.choice-card.selected {
  border-color: #c9ae87;
  box-shadow:
    0 0 0 3px rgba(201, 174, 135, 0.24),
    0 12px 30px rgba(201, 174, 135, 0.16);
  transform: translateY(-3px);
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

.choice-card strong {
  display: block;
  color: #1a1a1a;
  font-size: 1rem;
  margin-bottom: 0.35rem;
}

.choice-card small {
  display: block;
  color: #6c757d;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .input-block {
    padding: 1.2rem;
  }

  .option-grid.two,
  .option-grid.three {
    grid-template-columns: 1fr;
  }
}
</style>
