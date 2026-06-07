<template>
  <div class="walls-step">
    <header class="step-header text-center mb-4">
      <h2 class="page-title mb-2 text-dark fw-bold">Walls &amp; Paint</h2>
      <p class="text-muted fs-6 mb-0">Select wall finishes and enter required wall measurements.</p>
    </header>

    <div class="inputs-stack">
      <!-- 1. Curtains -->
      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">1. Curtains</h3>
        <p class="text-muted small mb-3">Choose the curtain option.</p>

        <div class="option-grid two">
          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.walls.curtainChoice === 'Choice 1' }"
            @click="store.walls.curtainChoice = 'Choice 1'"
          >
            <span class="choice-icon">1</span>
            <strong>Choice 1</strong>
            <small>Standard curtain option</small>
          </button>

          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.walls.curtainChoice === 'Choice 2' }"
            @click="store.walls.curtainChoice = 'Choice 2'"
          >
            <span class="choice-icon">2</span>
            <strong>Choice 2</strong>
            <small>Premium curtain option</small>
          </button>
        </div>
      </section>

      <!-- 2. Wall Area -->
      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">2. Wall Area</h3>
        <p class="text-muted small mb-3">Enter the total wall area for painting/wallpaper cost.</p>

        <div class="row">
          <div class="col-12 col-md-9 col-lg-7">
            <label class="form-label small fw-bold text-muted mb-2">Wall Area</label>
            <div
              class="input-group input-group-lg border rounded-3 overflow-hidden shadow-sm custom-focus-within"
            >
              <input
                v-model.number="store.walls.manualArea"
                type="number"
                class="form-control border-0 px-3"
                placeholder="Ex: 600"
                min="1"
              />
              <span class="input-group-text bg-white border-0 text-muted fw-bold pe-4">
                sq ft
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. Wall Moulding -->
      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">3. Wall Moulding</h3>
        <p class="text-muted small mb-3">Enter the total wall moulding length.</p>

        <div class="row">
          <div class="col-12 col-md-9 col-lg-7">
            <label class="form-label small fw-bold text-muted mb-2">Moulding Length</label>
            <div
              class="input-group input-group-lg border rounded-3 overflow-hidden shadow-sm custom-focus-within"
            >
              <input
                v-model.number="store.walls.mouldingLength"
                type="number"
                class="form-control border-0 px-3"
                placeholder="Ex: 45"
                min="1"
              />
              <span class="input-group-text bg-white border-0 text-muted fw-bold pe-4">
                linear meter
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. Ceiling Painting -->
      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">4. Ceiling Painting</h3>
        <p class="text-muted small mb-3">Ceiling painting is fixed as white.</p>

        <div class="fixed-card">
          <span class="choice-icon">✓</span>
          <div>
            <strong>White Ceiling Paint</strong>
            <small>Default ceiling paint option</small>
          </div>
        </div>
      </section>

      <!-- 5. Wall Painting -->
      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">5. Wall Painting</h3>
        <p class="text-muted small mb-3">Choose the wall painting option.</p>

        <div class="option-grid two">
          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.walls.wallPainting === 'Choice 1' }"
            @click="store.walls.wallPainting = 'Choice 1'"
          >
            <span class="choice-icon">1</span>
            <strong>Choice 1</strong>
            <small>Standard wall paint</small>
          </button>

          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.walls.wallPainting === 'Choice 2' }"
            @click="store.walls.wallPainting = 'Choice 2'"
          >
            <span class="choice-icon">2</span>
            <strong>Choice 2</strong>
            <small>Premium wall paint</small>
          </button>
        </div>
      </section>

      <!-- 6. Wallpaper -->
      <section class="input-block">
        <h3 class="input-block-title h6 fw-bold mb-1">6. Wallpaper</h3>
        <p class="text-muted small mb-3">Choose the wallpaper option.</p>

        <div class="option-grid two">
          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.walls.wallpaper === 'Choice 1' }"
            @click="store.walls.wallpaper = 'Choice 1'"
          >
            <span class="choice-icon">1</span>
            <strong>Choice 1</strong>
            <small>Standard wallpaper</small>
          </button>

          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.walls.wallpaper === 'Choice 2' }"
            @click="store.walls.wallpaper = 'Choice 2'"
          >
            <span class="choice-icon">2</span>
            <strong>Choice 2</strong>
            <small>Premium wallpaper</small>
          </button>
        </div>
      </section>

      <!-- 7. Doors -->
      <section class="input-block mt-4 mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">7. Doors</h3>
        <p class="text-muted small mb-3">Will the doors be changed or retained?</p>

        <div class="option-grid two">
          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.walls.doors === 'Changed' }"
            @click="store.walls.doors = 'Changed'"
          >
            <span class="choice-icon">C</span>
            <strong>Changed</strong>
            <small>Replace existing doors</small>
          </button>

          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.walls.doors === 'Retained' }"
            @click="store.walls.doors = 'Retained'"
          >
            <span class="choice-icon">R</span>
            <strong>Retained</strong>
            <small>Keep existing doors</small>
          </button>
        </div>
      </section>

      <!-- 8. Windows -->
      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">8. Windows</h3>
        <p class="text-muted small mb-3">Will the windows be changed or retained?</p>

        <div class="option-grid two">
          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.walls.windows === 'Changed' }"
            @click="store.walls.windows = 'Changed'"
          >
            <span class="choice-icon">C</span>
            <strong>Changed</strong>
            <small>Replace existing windows</small>
          </button>

          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.walls.windows === 'Retained' }"
            @click="store.walls.windows = 'Retained'"
          >
            <span class="choice-icon">R</span>
            <strong>Retained</strong>
            <small>Keep existing windows</small>
          </button>
        </div>
      </section>

      <!-- 9. Cladding -->
      <section class="input-block">
        <h3 class="input-block-title h6 fw-bold mb-1">9. Cladding</h3>
        <p class="text-muted small mb-3">Does the room require wall cladding?</p>

        <div class="option-grid two">
          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.walls.hasCladding === true }"
            @click="store.walls.hasCladding = true"
          >
            <span class="choice-icon">✓</span>
            <strong>Yes</strong>
            <small>Add wall cladding</small>
          </button>

          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.walls.hasCladding === false }"
            @click="store.walls.hasCladding = false"
          >
            <span class="choice-icon">×</span>
            <strong>No</strong>
            <small>No wall cladding</small>
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
.walls-step {
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

.option-grid.two {
  grid-template-columns: repeat(2, minmax(0, 1fr));
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
  font-size: 1.25rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
}

.choice-card strong,
.fixed-card strong {
  display: block;
  color: #1a1a1a;
  font-size: 1rem;
  margin-bottom: 0.35rem;
}

.choice-card small,
.fixed-card small {
  display: block;
  color: #6c757d;
  line-height: 1.4;
}

.fixed-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #fcfaf8;
  border: 1px solid #ede5d8;
  border-radius: 18px;
  padding: 1.2rem;
}

.fixed-card .choice-icon {
  margin-bottom: 0;
  flex-shrink: 0;
}

.custom-focus-within:focus-within {
  border-color: #c9ae87 !important;
  box-shadow: 0 0 0 3px rgba(201, 174, 135, 0.12) !important;
}

@media (max-width: 768px) {
  .input-block {
    padding: 1.2rem;
  }

  .option-grid.two {
    grid-template-columns: 1fr;
  }
}
</style>
