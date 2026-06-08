<template>
  <div class="furnishing-step">
    <header class="step-header text-center mb-4">
      <h2 class="page-title mb-2 text-dark fw-bold">Room Furnishing</h2>
      <p class="text-muted fs-6 mb-0">Select bed setup and furniture options for the bedroom.</p>
    </header>

    <div class="inputs-stack">
      <!-- 1. Bed Size -->
      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">1. Bed Size</h3>
        <p class="text-muted small mb-3">Choose the bed size.</p>

        <div class="image-option-grid two">
          <div
            v-for="option in bedOptions"
            :key="option.value"
            class="image-option-cell"
            @click="store.furnishing.bedSize = option.value"
          >
            <StyleCard
              compact
              :name="option.name"
              :description="option.description"
              :image="option.image"
              :is-selected="store.furnishing.bedSize === option.value"
            />
          </div>
        </div>
      </section>

      <!-- 2. Bed Setup -->
      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">2. Bed Setup</h3>
        <p class="text-muted small mb-3">Select required bed additions.</p>

        <div class="image-option-grid three">
          <div
            class="image-option-cell"
            @click="store.furnishing.hasHeadboard = !store.furnishing.hasHeadboard"
          >
            <StyleCard
              compact
              name="Headboard"
              description="Tap to select/deselect"
              :image="headboardImg"
              :is-selected="store.furnishing.hasHeadboard"
            />
          </div>

          <div
            class="image-option-cell"
            @click="store.furnishing.hasBedsideCladding = !store.furnishing.hasBedsideCladding"
          >
            <StyleCard
              compact
              name="Bedside Cladding"
              description="Tap to select/deselect"
              :image="bedsideCladdingImg"
              :is-selected="store.furnishing.hasBedsideCladding"
            />
          </div>

          <div
            class="image-option-cell"
            @click="store.furnishing.hasDuvet = !store.furnishing.hasDuvet"
          >
            <StyleCard
              compact
              name="Duvet"
              description="Tap to select/deselect"
              :image="duvetImg"
              :is-selected="store.furnishing.hasDuvet"
            />
          </div>
        </div>
      </section>

      <!-- 3. Side Table -->
      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">3. Side Table</h3>
        <p class="text-muted small mb-3">Select side table option.</p>

        <div class="image-option-grid one">
          <div class="image-option-cell" @click="store.furnishing.sideTableChoice = 'Choice 1'">
            <StyleCard
              compact
              name="Side Table"
              description="Modern side table"
              :image="sideTableImg"
              :is-selected="store.furnishing.sideTableChoice === 'Choice 1'"
            />
          </div>
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

        <div class="image-option-grid one">
          <div class="image-option-cell" @click="store.furnishing.tvUnitChoice = 'Choice 1'">
            <StyleCard
              compact
              name="TV Unit"
              description="Modern TV unit"
              :image="tvUnitImg"
              :is-selected="store.furnishing.tvUnitChoice === 'Choice 1'"
            />
          </div>
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

      <!-- 8. Dressing Table -->
      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">8. Dressing Table</h3>
        <p class="text-muted small mb-3">Do you need a dressing table?</p>

       <div class="option-grid two">
  <button
    type="button"
    class="choice-card"
    :class="{ selected: store.furnishing.hasDressingTable === true }"
    @click="store.furnishing.hasDressingTable = true"
  >
    <span class="choice-icon">✓</span>
    <strong>Yes</strong>
    <small>Add dressing table</small>
  </button>

  <button
    type="button"
    class="choice-card"
    :class="{ selected: store.furnishing.hasDressingTable === false }"
    @click="store.furnishing.hasDressingTable = false"
  >
    <span class="choice-icon">×</span>
    <strong>No</strong>
    <small>No dressing table</small>
  </button>
</div>
      </section>

      <!-- 9. Carpet -->
      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">9. Carpet</h3>
        <p class="text-muted small mb-3">Do you need a carpet?</p>

        <div class="option-grid two">
          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.furnishing.hasCarpet === true }"
            @click="store.furnishing.hasCarpet = true"
          >
            <span class="choice-icon">✓</span>
            <strong>Yes</strong>
            <small>Add carpet</small>
          </button>

          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.furnishing.hasCarpet === false }"
            @click="store.furnishing.hasCarpet = false"
          >
            <span class="choice-icon">×</span>
            <strong>No</strong>
            <small>No carpet</small>
          </button>
        </div>
      </section>

      <!-- 10. Bench -->
      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">10. Bench</h3>

        <p class="text-muted small mb-3">Bench placed at the foot of the bed.</p>

        <div class="option-grid two">
          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.furnishing.hasBench === true }"
            @click="store.furnishing.hasBench = true"
          >
            <span class="choice-icon">✓</span>
            <strong>Yes</strong>
            <small>Add bench</small>
          </button>

          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.furnishing.hasBench === false }"
            @click="store.furnishing.hasBench = false"
          >
            <span class="choice-icon">×</span>
            <strong>No</strong>
            <small>No bench</small>
          </button>
        </div>
      </section>

      <!-- 11. A/C Type -->
      <section class="input-block">
        <h3 class="input-block-title h6 fw-bold mb-1">11. A/C Type</h3>

        <p class="text-muted small mb-3">Select the air conditioning type.</p>

       <div class="image-option-grid two">
  <div
    v-for="option in acOptions"
    :key="option.value"
    class="image-option-cell"
    @click="store.furnishing.acType = option.value"
  >
    <StyleCard
      compact
      :name="option.name"
      :description="option.description"
      :image="option.image"
      :is-selected="store.furnishing.acType === option.value"
    />
  </div>
</div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import kingBedImg from '@/assets/Furnishing/king-bed.png'
import queenBedImg from '@/assets/Furnishing/queen-bed.png'
import StyleCard from '@/components/StyleCard.vue'
import headboardImg from '@/assets/Furnishing/headboard.png'
import bedsideCladdingImg from '@/assets/Furnishing/bedside-cladding.png'
import duvetImg from '@/assets/Furnishing/duvet.png'

import sideTableImg from '@/assets/Furnishing/side-table.png'
import tvUnitImg from '@/assets/Furnishing/tv-unit.png'

import splitAcImg from '@/assets/Furnishing/split-ac.png'
import cassetteImg from '@/assets/Furnishing/cassette.png'
import { usePlannerStore } from '@/stores/Planner'

const store = usePlannerStore()

const bedOptions = [
  {
    value: 'King' as const,
    name: 'King Size',
    description: 'Larger premium bed setup',
    image: kingBedImg,
  },
  {
    value: 'Queen' as const,
    name: 'Queen Size',
    description: 'Compact comfortable bed setup',
    image: queenBedImg,
  },
]
const bedSetupOptions = [
  {
    key: 'headboard',
    name: 'Headboard',
    image: headboardImg,
  },
  {
    key: 'cladding',
    name: 'Bedside Cladding',
    image: bedsideCladdingImg,
  },
  {
    key: 'duvet',
    name: 'Duvet',
    image: duvetImg,
  },
]

const sideTableOptions = [
  {
    value: 'Choice 1',
    name: 'Side Table',
    description: 'Modern side table',
    image: sideTableImg,
  },
]

const tvUnitOptions = [
  {
    value: 'Choice 1',
    name: 'TV Unit',
    description: 'Modern TV unit',
    image: tvUnitImg,
  },
]

const acOptions = [
  {
    value: 'Split' as const,
    name: 'Split A/C',
    description: 'Wall mounted system',
    image: splitAcImg,
  },
  {
    value: 'Cassette' as const,
    name: 'Cassette A/C',
    description: 'Ceiling mounted system',
    image: cassetteImg,
  },
]
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

.image-option-grid {
  display: grid;
  gap: 1rem;
}

.image-option-grid.one {
  grid-template-columns: 1fr;
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
  .option-grid.three,
  .image-option-grid.two,
  .image-option-grid.three {
    grid-template-columns: 1fr;
  }
}
</style>
