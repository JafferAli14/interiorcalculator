<template>
  <div class="ceilings-step">
    <header class="step-header text-center mb-4">
      <h2 class="page-title mb-2 text-dark fw-bold">Ceiling &amp; Lighting</h2>
      <p class="text-muted fs-6 mb-0">
        Select the ceiling level and enter all required lighting details.
      </p>
    </header>

    <div class="inputs-stack">
      <!-- 1. Gypsum Ceiling -->
      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">1. Gypsum Ceiling</h3>
        <p class="text-muted small mb-3">Which ceiling level does the bedroom require?</p>

        <div class="gypsum-picker d-flex gap-3">
          <div
            v-for="option in ceilingOptions"
            :key="option.level"
            class="gypsum-picker-cell flex-fill"
            role="button"
            tabindex="0"
            @click="onGypsumPick(option.level)"
            @keydown.enter.prevent="onGypsumPick(option.level)"
            @keydown.space.prevent="onGypsumPick(option.level)"
          >
            <StyleCard
              compact
              :name="option.name"
              :description="option.description"
              :image="option.image"
              :is-selected="store.ceiling.level === option.level"
            />
          </div>
        </div>
      </section>

      <!-- 2. Ceiling Area -->
      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">2. Ceiling Area</h3>
        <p class="text-muted small mb-3">Enter the ceiling area for cost calculation.</p>

        <div class="row">
          <div class="col-12 col-md-9 col-lg-7">
            <label class="form-label small fw-bold text-muted mb-2">Ceiling Area</label>
            <div class="input-group input-group-lg border rounded-3 overflow-hidden shadow-sm custom-focus-within">
              <input
                v-model.number="store.ceiling.manualArea"
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

      <!-- 3. Cornish -->
      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">3. Cornish</h3>
        <p class="text-muted small mb-3">Choose cornish size and enter its total length.</p>

        <div class="option-grid two mb-4">
          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.ceiling.cornishSize === 5 }"
            @click="store.ceiling.cornishSize = 5"
          >
            <span class="choice-icon">5</span>
            <strong>5cm Cornish</strong>
            <small>Simple and clean finish</small>
          </button>

          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.ceiling.cornishSize === 10 }"
            @click="store.ceiling.cornishSize = 10"
          >
            <span class="choice-icon">10</span>
            <strong>10cm Cornish</strong>
            <small>Bolder premium finish</small>
          </button>
        </div>

        <div class="row">
          <div class="col-12 col-md-9 col-lg-7">
            <label class="form-label small fw-bold text-muted mb-2">Cornish Length</label>
            <div class="input-group input-group-lg border rounded-3 overflow-hidden shadow-sm custom-focus-within">
              <input
                v-model.number="store.ceiling.cornishLength"
                type="number"
                class="form-control border-0 px-3"
                placeholder="Ex: 40"
                min="1"
              />
              <span class="input-group-text bg-white border-0 text-muted fw-bold pe-4">
                linear meter
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. Ceiling Lights -->
      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">4. Ceiling Lights</h3>
        <p class="text-muted small mb-3">Select lighting type and enter number of lights.</p>

        <div class="option-grid three mb-4">
          <button
            v-for="light in lightingOptions"
            :key="light.value"
            type="button"
            class="choice-card"
            :class="{ selected: store.ceiling.lightingType === light.value }"
            @click="store.ceiling.lightingType = light.value"
          >
            <span class="choice-icon">{{ light.icon }}</span>
            <strong>{{ light.label }}</strong>
            <small>{{ light.description }}</small>
          </button>
        </div>

        <div class="row">
          <div class="col-12 col-md-9 col-lg-7">
            <label class="form-label small fw-bold text-muted mb-2">Number of Lights</label>
            <input
              v-model.number="store.ceiling.lightsCount"
              type="number"
              class="form-control form-control-lg rounded-3 shadow-sm"
              placeholder="Ex: 8"
              min="1"
            />
          </div>
        </div>
      </section>

      <!-- 5. Curtain Box -->
      <section class="input-block">
        <h3 class="input-block-title h6 fw-bold mb-1">5. Curtain Box</h3>
        <p class="text-muted small mb-3">Does the ceiling design require a curtain box?</p>

        <div class="option-grid two mb-4">
          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.ceiling.hasCurtainBox === true }"
            @click="store.ceiling.hasCurtainBox = true"
          >
            <span class="choice-icon">✓</span>
            <strong>Yes</strong>
            <small>Add curtain box</small>
          </button>

          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.ceiling.hasCurtainBox === false }"
            @click="store.ceiling.hasCurtainBox = false"
          >
            <span class="choice-icon">×</span>
            <strong>No</strong>
            <small>No curtain box required</small>
          </button>
        </div>

        <div v-if="store.ceiling.hasCurtainBox === true" class="row">
          <div class="col-12 col-md-9 col-lg-7">
            <label class="form-label small fw-bold text-muted mb-2">
              Curtain Box Length
            </label>
            <div class="input-group input-group-lg border rounded-3 overflow-hidden shadow-sm custom-focus-within">
              <input
                v-model.number="store.ceiling.curtainBoxLength"
                type="number"
                class="form-control border-0 px-3"
                placeholder="Ex: 12"
                min="1"
              />
              <span class="input-group-text bg-white border-0 text-muted fw-bold pe-4">
                linear meter
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import level1Img from '@/assets/ceiling/level1.png'
import level2Img from '@/assets/ceiling/level2.png'
import StyleCard from '@/components/StyleCard.vue'
import { usePlannerStore } from '@/stores/Planner'

const store = usePlannerStore()

function onGypsumPick(level: 1 | 2) {
  store.setCeilingLevel(level)
}

const ceilingOptions = [
  {
    level: 1 as const,
    name: 'Level 1',
    description: 'Simple gypsum ceiling with clean premium finish.',
    image: level1Img,
  },
  {
    level: 2 as const,
    name: 'Level 2',
    description: 'Layered gypsum ceiling with detailed design.',
    image: level2Img,
  },
]

const lightingOptions = [
  {
    value: 'Track' as const,
    label: 'Track Lights',
    icon: '◉',
    description: 'Modern linear lighting',
  },
  {
    value: 'Spot' as const,
    label: 'Spot Lights',
    icon: '✦',
    description: 'Focused ceiling lighting',
  },
  {
    value: 'Hidden' as const,
    label: 'Hidden Lights',
    icon: '☾',
    description: 'Soft indirect lighting',
  },
]
</script>

<style scoped>
.ceilings-step {
  width: 100%;
  max-width: 760px;
  margin-inline: auto;
}

.inputs-stack {
  width: 100%;
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

.input-block .text-muted.small {
  font-size: 0.95rem;
}

.gypsum-picker-cell {
  cursor: pointer;
  transition: transform 0.2s ease;
  outline: none;
}

.gypsum-picker-cell:hover {
  transform: translateY(-2px);
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
  color: #6c757d;
  line-height: 1.4;
}

.custom-focus-within:focus-within {
  border-color: #c9ae87 !important;
  box-shadow: 0 0 0 3px rgba(201, 174, 135, 0.12) !important;
}

.form-label.small {
  font-size: 0.95rem;
}

.form-control {
  font-size: 1rem;
}

.input-group-text {
  font-size: 0.95rem;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

@media (max-width: 768px) {
  .input-block {
    padding: 1.2rem;
  }

  .gypsum-picker {
    flex-direction: column;
  }

  .option-grid.two,
  .option-grid.three {
    grid-template-columns: 1fr;
  }
}
</style>