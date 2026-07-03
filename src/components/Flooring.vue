<template>
  <div class="flooring-step">
    <header class="step-header text-center mb-4">
      <h2 class="page-title mb-2 text-dark fw-bold">Flooring</h2>
      <p class="text-muted fs-6 mb-0">
        Select tile material, size, skirting, and additional flooring options.
      </p>
    </header>

    <div class="inputs-stack">
      <!-- 1. Tile Material -->
      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">1. Tile Material</h3>
        <p class="text-muted small mb-3">Choose the main flooring material.</p>

        <div class="image-option-grid three">
          <div
            v-for="item in materialOptions"
            :key="item.value"
            class="image-option-cell"
            @click="store.flooring.material = item.value"
          >
            <StyleCard
              compact
              :name="item.label"
              :description="item.description"
              :image="item.image"
              :is-selected="store.flooring.material === item.value"
            />
          </div>
        </div>
      </section>

      <!-- 2. Tile Area -->
      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">2. Tile Area</h3>
        <p class="text-muted small mb-3">Enter the total tile area.</p>

        <div class="row">
          <div class="col-12 col-md-9 col-lg-7">
            <label class="form-label small fw-bold text-muted mb-2">Tile Area</label>
            <div
              class="input-group input-group-lg border rounded-3 overflow-hidden shadow-sm custom-focus-within"
            >
              <input
                v-model.number="store.flooring.manualArea"
                type="number"
                class="form-control border-0 px-3"
                placeholder="Ex: 250"
                min="1"
              />
              <span class="input-group-text bg-white border-0 text-muted fw-bold pe-4">
                sq ft
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. Tile Size -->
      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">3. Tile Size</h3>
        <p class="text-muted small mb-3">Choose the tile size.</p>

        <div class="option-grid two">
          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.flooring.tileSize === '120x120' }"
            @click="store.flooring.tileSize = '120x120'"
          >
            <span class="choice-icon">120</span>
            <strong>120 × 120</strong>
            <small>Large format premium tile</small>
          </button>

          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.flooring.tileSize === '60x60' }"
            @click="store.flooring.tileSize = '60x60'"
          >
            <span class="choice-icon">60</span>
            <strong>60 × 60</strong>
            <small>Standard tile size</small>
          </button>
        </div>
      </section>

      <!-- 4. Skirting -->
      <!-- 4. Skirting -->
      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">4. Skirting</h3>
        <p class="text-muted small mb-3">Choose skirting height and enter total skirting length.</p>

        <div class="option-grid two mb-4">
          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.flooring.skirtingSize === 10 }"
            @click="store.flooring.skirtingSize = 10"
          >
            <span class="choice-icon">10</span>
            <strong>10cm Skirting</strong>
            <small>Clean standard skirting</small>
          </button>

          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.flooring.skirtingSize === 15 }"
            @click="store.flooring.skirtingSize = 15"
          >
            <span class="choice-icon">15</span>
            <strong>15cm Skirting</strong>
            <small>Taller premium skirting</small>
          </button>
        </div>

        <div class="row">
          <div class="col-12 col-md-9 col-lg-7">
            <label class="form-label small fw-bold text-muted mb-2">Skirting Length</label>
            <div
              class="input-group input-group-lg border rounded-3 overflow-hidden shadow-sm custom-focus-within"
            >
              <input
                v-model.number="store.flooring.skirtingLength"
                type="number"
                class="form-control border-0 px-3"
                placeholder="Ex: 35"
                min="1"
              />
              <span class="input-group-text bg-white border-0 text-muted fw-bold pe-4">
                linear meter
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- 5. Parquet -->
      <!-- 5. Parquet -->
      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">5. Parquet</h3>
        <p class="text-muted small mb-3">Does the bedroom require parquet flooring?</p>

        <div class="option-grid two mb-4">
          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.flooring.hasParquet === true }"
            @click="
              store.flooring.hasParquet = true;
              store.flooring.parquetArea = store.flooring.parquetArea || 1;
            "
          >
            <span class="choice-icon">✓</span>
            <strong>Yes</strong>
            <small>Add parquet flooring</small>
          </button>

          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.flooring.hasParquet === false }"
            @click="
              store.flooring.hasParquet = false;
              store.flooring.parquetArea = null;
            "
          >
            <span class="choice-icon">×</span>
            <strong>No</strong>
            <small>No parquet required</small>
          </button>
        </div>

        <div v-if="store.flooring.hasParquet === true" class="row">
          <div class="col-12 col-md-9 col-lg-7">
            <label class="form-label small fw-bold text-muted mb-2">Parquet Area</label>
            <div
              class="input-group input-group-lg border rounded-3 overflow-hidden shadow-sm custom-focus-within"
            >
              <input
                v-model.number="store.flooring.parquetArea"
                type="number"
                class="form-control border-0 px-3"
                placeholder="Ex: 80"
                min="1"
              />
              <span class="input-group-text bg-white border-0 text-muted fw-bold pe-4">
                sq ft
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- 6. Glass Work -->
      <!-- 6. Glass Work -->
      <section class="input-block">
        <h3 class="input-block-title h6 fw-bold mb-1">6. Glass Work</h3>
        <p class="text-muted small mb-3">Does this section require glass work?</p>

        <div class="option-grid two mb-4">
          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.flooring.hasGlassWork === true }"
            @click="
              store.flooring.hasGlassWork = true;
              store.flooring.glassWorkArea = store.flooring.glassWorkArea || 1;
            "
          >
            <span class="choice-icon">✓</span>
            <strong>Yes</strong>
            <small>Add glass work</small>
          </button>

          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.flooring.hasGlassWork === false }"
            @click="
              store.flooring.hasGlassWork = false;
              store.flooring.glassWorkArea = null;
            "
          >
            <span class="choice-icon">×</span>
            <strong>No</strong>
            <small>No glass work required</small>
          </button>
        </div>

        <div v-if="store.flooring.hasGlassWork === true" class="row">
          <div class="col-12 col-md-9 col-lg-7">
            <label class="form-label small fw-bold text-muted mb-2">Glass Work Area</label>
            <div
              class="input-group input-group-lg border rounded-3 overflow-hidden shadow-sm custom-focus-within"
            >
              <input
                v-model.number="store.flooring.glassWorkArea"
                type="number"
                class="form-control border-0 px-3"
                placeholder="Ex: 40"
                min="1"
              />
              <span class="input-group-text bg-white border-0 text-muted fw-bold pe-4">
                sq ft
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import porcelainImg from '@/assets/Flooring/porcelain.png'
import marbleImg from '@/assets/Flooring/marble.png'
import graniteImg from '@/assets/Flooring/granite.png'
import StyleCard from '@/components/StyleCard.vue'
import { usePlannerStore } from '@/stores/Planner'

const store = usePlannerStore()

const materialOptions = [
  {
    value: 'Porcelain' as const,
    label: 'Porcelain',
    description: 'Durable and modern finish',
    image: porcelainImg,
  },
  {
    value: 'Marble' as const,
    label: 'Marble',
    description: 'Luxury natural stone look',
    image: marbleImg,
  },
  {
    value: 'Granite' as const,
    label: 'Granite',
    description: 'Strong premium flooring',
    image: graniteImg,
  },
]
</script>

<style scoped>
.flooring-step {
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

.option-grid.three {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.image-option-grid {
  display: grid;
  gap: 1rem;
}

.image-option-grid.two {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.image-option-grid.three {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.image-option-cell {
  cursor: pointer;
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

.custom-focus-within:focus-within {
  border-color: #c9ae87 !important;
  box-shadow: 0 0 0 3px rgba(201, 174, 135, 0.12) !important;
}

@media (max-width: 768px) {
  .input-block {
    padding: 1.2rem;
  }

  .option-grid.two,
  .option-grid.three,
  .image-option-grid.two,
  .image-option-grid.three {
    grid-template-columns: 1fr;
  }
}
</style>
