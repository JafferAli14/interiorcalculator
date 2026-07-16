 <template>
  <div class="ceilings-step">
    <header class="step-header text-center mb-4">
      <h2 class="page-title mb-2 text-dark fw-bold">Ceiling &amp; Lighting</h2>
      <p class="text-muted fs-6 mb-0">
        Select the ceiling level and enter all required lighting details.
      </p>
    </header>

    <div class="inputs-stack">
      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">1. Gypsum Ceiling</h3>
        <p class="text-muted small mb-3">Which ceiling level does the bedroom require?</p>

        <div class="gypsum-picker d-flex gap-3">
          <div
            v-for="option in ceilingOptions"
            :key="option.code"
            class="gypsum-picker-cell flex-fill"
            role="button"
            tabindex="0"
            @click="selectGypsum(option.code)"
            @keydown.enter.prevent="selectGypsum(option.code)"
            @keydown.space.prevent="selectGypsum(option.code)"
          >
            <StyleCard
              compact
              :name="option.name"
              :description="option.description"
              :image="option.image"
              :is-selected="store.ceiling.gypsumCeiling.priceItemCode === option.code"
            />
          </div>
        </div>
      </section>

      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">2. Ceiling Area</h3>
        <p class="text-muted small mb-3">Enter the ceiling area for cost calculation.</p>

        <div class="row">
          <div class="col-12 col-md-9 col-lg-7">
            <label class="form-label small fw-bold text-muted mb-2">Ceiling Area</label>
            <div
              class="input-group input-group-lg border rounded-3 overflow-hidden shadow-sm custom-focus-within"
            >
              <input
                v-model.number="store.measurements.ceilingArea"
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

      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">3. Cornish</h3>
        <p class="text-muted small mb-3">Choose cornish size and enter its total length.</p>

        <div class="option-grid two mb-4">
          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.ceiling.cornish.priceItemCode === 'CORNISH_5CM' }"
            @click="selectCornish('CORNISH_5CM')"
          >
            <span class="choice-icon">5</span>
            <strong>5cm Cornish</strong>
            <small>Simple and clean finish</small>
          </button>

          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.ceiling.cornish.priceItemCode === 'CORNISH_10CM' }"
            @click="selectCornish('CORNISH_10CM')"
          >
            <span class="choice-icon">10</span>
            <strong>10cm Cornish</strong>
            <small>Bolder premium finish</small>
          </button>
        </div>

        <div class="row">
          <div class="col-12 col-md-9 col-lg-7">
            <label class="form-label small fw-bold text-muted mb-2">Cornish Length</label>
            <div
              class="input-group input-group-lg border rounded-3 overflow-hidden shadow-sm custom-focus-within"
            >
              <input
                v-model.number="store.ceiling.cornish.length"
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

      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">4. Ceiling Lights</h3>
        <p class="text-muted small mb-3">Select all required lighting types and enter quantities.</p>

        <div class="lighting-picker-grid mb-4">
          <div
            v-for="light in lightingOptions"
            :key="light.code"
            class="lighting-picker-cell"
            role="button"
            tabindex="0"
            @click="toggleLight(light.code)"
            @keydown.enter.prevent="toggleLight(light.code)"
            @keydown.space.prevent="toggleLight(light.code)"
          >
            <StyleCard
              compact
              :name="light.label"
              :description="light.description"
              :image="light.image"
              :is-selected="isLightSelected(light.code)"
            />
          </div>
        </div>

        <div class="light-quantity-stack">
          <div v-for="light in selectedLightingOptions" :key="light.code" class="row mb-3">
            <div class="col-12 col-md-9 col-lg-7">
              <label class="form-label small fw-bold text-muted mb-2">
                {{ light.label }} Quantity
              </label>
              <input
                :value="getLightQuantity(light.code) ?? ''"
                type="number"
                class="form-control form-control-lg rounded-3 shadow-sm"
                placeholder="Ex: 8"
                min="1"
                @input="setLightQuantity(light.code, Number(($event.target as HTMLInputElement).value))"
              />
            </div>
          </div>
        </div>

        <p v-if="store.ceiling.ceilingLights.length === 0" class="text-muted small mb-0">
          Select at least one lighting type.
        </p>
      </section>

      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">5. Chandelier</h3>
        <p class="text-muted small mb-3">Does the ceiling design include a chandelier?</p>

        <div class="option-grid two mb-4">
          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.ceiling.chandelier.enabled === true }"
            @click="enableChandelier"
          >
            <span class="choice-icon word">Yes</span>
            <strong>Yes</strong>
            <small>Add chandelier</small>
          </button>

          <button
            type="button"
            class="choice-card"
            :class="{
              selected: store.ceiling.chandelierAnswered && store.ceiling.chandelier.enabled === false,
            }"
            @click="disableChandelier"
          >
            <span class="choice-icon word">No</span>
            <strong>No</strong>
            <small>No chandelier required</small>
          </button>
        </div>

        <template v-if="store.ceiling.chandelier.enabled">
          <div class="option-grid two mb-4">
            <button
              type="button"
              class="choice-card"
              :class="{ selected: store.ceiling.chandelier.pricingMode === 'Calculated' }"
              @click="setChandelierMode('Calculated')"
            >
              <span class="choice-icon">#</span>
              <strong>Calculated</strong>
              <small>Use catalogue rate and quantity</small>
            </button>

            <button
              type="button"
              class="choice-card"
              :class="{ selected: store.ceiling.chandelier.pricingMode === 'Custom' }"
              @click="setChandelierMode('Custom')"
            >
              <span class="choice-icon word">QAR</span>
              <strong>Custom Price</strong>
              <small>Use manual agreed price</small>
            </button>
          </div>

          <div v-if="store.ceiling.chandelier.pricingMode === 'Calculated'" class="row">
            <div class="col-12 col-md-9 col-lg-7">
              <label class="form-label small fw-bold text-muted mb-2">Chandelier Quantity</label>
              <input
                v-model.number="store.ceiling.chandelier.quantity"
                type="number"
                class="form-control form-control-lg rounded-3 shadow-sm"
                placeholder="Ex: 1"
                min="1"
              />
            </div>
          </div>

          <div v-if="store.ceiling.chandelier.pricingMode === 'Custom'" class="row">
            <div class="col-12 col-md-9 col-lg-7">
              <label class="form-label small fw-bold text-muted mb-2">Custom Price</label>
              <div
                class="input-group input-group-lg border rounded-3 overflow-hidden shadow-sm custom-focus-within"
              >
                <span class="input-group-text bg-white border-0 text-muted fw-bold ps-4">
                  QAR
                </span>
                <input
                  v-model.number="store.ceiling.chandelier.customPrice"
                  type="number"
                  class="form-control border-0 px-3"
                  placeholder="Ex: 15000"
                  min="1"
                />
              </div>
            </div>
          </div>
        </template>
      </section>

      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">6. Curtain Box</h3>
        <p class="text-muted small mb-3">Does the ceiling design require a curtain box?</p>

        <div class="option-grid two mb-4">
          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.ceiling.curtainBox.enabled === true }"
            @click="enableCurtainBox"
          >
            <span class="choice-icon word">Yes</span>
            <strong>Yes</strong>
            <small>Add curtain box</small>
          </button>

          <button
            type="button"
            class="choice-card"
            :class="{
              selected: store.ceiling.curtainBoxAnswered && store.ceiling.curtainBox.enabled === false,
            }"
            @click="disableCurtainBox"
          >
            <span class="choice-icon word">No</span>
            <strong>No</strong>
            <small>No curtain box required</small>
          </button>
        </div>

        <div v-if="store.ceiling.curtainBox.enabled" class="row">
          <div class="col-12 col-md-9 col-lg-7">
            <label class="form-label small fw-bold text-muted mb-2">Curtain Box Length</label>
            <div
              class="input-group input-group-lg border rounded-3 overflow-hidden shadow-sm custom-focus-within"
            >
              <input
                v-model.number="store.ceiling.curtainBox.length"
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

      <section class="input-block">
        <h3 class="input-block-title h6 fw-bold mb-1">7. Ceiling Painting</h3>
        <p class="text-muted small mb-3">Ceiling painting is required. Enter the paint colour.</p>

        <div class="row">
          <div class="col-12 col-md-9 col-lg-7">
            <label class="form-label small fw-bold text-muted mb-2">Paint Colour</label>
            <input
              v-model="store.ceiling.ceilingPainting.paintColour"
              type="text"
              class="form-control form-control-lg rounded-3 shadow-sm"
              placeholder="Ex: Warm white"
            />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import level1Img from '@/assets/ceiling/level1.png'
import level2Img from '@/assets/ceiling/level2.png'
import StyleCard from '@/components/StyleCard.vue'
import trackLightImg from '@/assets/ceiling/track-lights.png'
import spotLightImg from '@/assets/ceiling/spot-lights.png'
import hiddenLightImg from '@/assets/ceiling/hidden-lights.png'
import stripLightImg from '@/assets/ceiling/strip-lights.png'

import { usePlannerStore } from '@/stores/Planner'
import type { PricingMode } from '@/types/bedroomPlanner'

const store = usePlannerStore()

type GypsumCode = 'CEILING_LEVEL_1' | 'CEILING_LEVEL_2'
type CornishCode = 'CORNISH_5CM' | 'CORNISH_10CM'
type LightCode = 'LIGHT_TRACK' | 'LIGHT_SPOT' | 'LIGHT_HIDDEN' | 'LIGHT_STRIP'

const ceilingOptions = [
  {
    code: 'CEILING_LEVEL_1' as const,
    name: 'Level 1',
    description: 'Simple gypsum ceiling with clean premium finish.',
    image: level1Img,
  },
  {
    code: 'CEILING_LEVEL_2' as const,
    name: 'Level 2',
    description: 'Layered gypsum ceiling with detailed design.',
    image: level2Img,
  },
]

const lightingOptions = [
  {
    code: 'LIGHT_TRACK' as const,
    label: 'Track Lights',
    description: 'Modern linear lighting',
    image: trackLightImg,
  },
  {
    code: 'LIGHT_SPOT' as const,
    label: 'Spot Lights',
    description: 'Focused ceiling lighting',
    image: spotLightImg,
  },
  {
    code: 'LIGHT_HIDDEN' as const,
    label: 'Hidden Lights',
    description: 'Soft indirect lighting',
    image: hiddenLightImg,
  },
  {
    code: 'LIGHT_STRIP' as const,
    label: 'Strip Light',
    description: 'Decorative LED strip lighting',
    image: stripLightImg,
  },
]

const selectedLightingOptions = computed(() =>
  lightingOptions.filter((light) => isLightSelected(light.code)),
)

function selectGypsum(code: GypsumCode) {
  store.ceiling.gypsumCeiling.enabled = true
  store.ceiling.gypsumCeiling.priceItemCode = code
}

function selectCornish(code: CornishCode) {
  store.ceiling.cornish.enabled = true
  store.ceiling.cornish.priceItemCode = code
}

function isLightSelected(code: LightCode) {
  return store.ceiling.ceilingLights.some((light) => light.enabled && light.priceItemCode === code)
}

function toggleLight(code: LightCode) {
  if (isLightSelected(code)) {
    store.ceiling.ceilingLights = store.ceiling.ceilingLights.filter(
      (light) => light.priceItemCode !== code,
    )
    return
  }

  store.ceiling.ceilingLights.push({
    enabled: true,
    priceItemCode: code,
    quantity: null,
  })
}

function getLightQuantity(code: LightCode) {
  return store.ceiling.ceilingLights.find((light) => light.priceItemCode === code)?.quantity ?? null
}

function setLightQuantity(code: LightCode, value: number) {
  const light = store.ceiling.ceilingLights.find((item) => item.priceItemCode === code)
  if (!light) return

  light.quantity = Number.isFinite(value) && value > 0 ? value : null
}

function enableChandelier() {
  store.ceiling.chandelierAnswered = true
  store.ceiling.chandelier.enabled = true
  store.ceiling.chandelier.priceItemCode = 'CHANDELIER'
  store.ceiling.chandelier.pricingMode = store.ceiling.chandelier.pricingMode ?? 'Calculated'
}

function disableChandelier() {
  store.ceiling.chandelierAnswered = true
  store.ceiling.chandelier.enabled = false
  store.ceiling.chandelier.priceItemCode = null
  store.ceiling.chandelier.pricingMode = null
  store.ceiling.chandelier.quantity = null
  store.ceiling.chandelier.customPrice = null
}

function setChandelierMode(mode: PricingMode) {
  store.ceiling.chandelier.enabled = true
  store.ceiling.chandelier.priceItemCode = 'CHANDELIER'
  store.ceiling.chandelier.pricingMode = mode

  if (mode === 'Calculated') {
    store.ceiling.chandelier.customPrice = null
    return
  }

  store.ceiling.chandelier.quantity = null
}

function enableCurtainBox() {
  store.ceiling.curtainBoxAnswered = true
  store.ceiling.curtainBox.enabled = true
  store.ceiling.curtainBox.priceItemCode = 'CURTAIN_BOX'
}

function disableCurtainBox() {
  store.ceiling.curtainBoxAnswered = true
  store.ceiling.curtainBox.enabled = false
  store.ceiling.curtainBox.priceItemCode = null
  store.ceiling.curtainBox.length = null
}
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

.gypsum-picker-cell,
.lighting-picker-cell {
  cursor: pointer;
  transition: transform 0.2s ease;
  outline: none;
}

.gypsum-picker-cell:hover,
.lighting-picker-cell:hover {
  transform: translateY(-2px);
}

.option-grid {
  display: grid;
  gap: 1rem;
}

.option-grid.two {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.lighting-picker-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
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

.choice-icon.word {
  font-size: 0.8rem;
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
  .lighting-picker-grid {
    grid-template-columns: 1fr;
  }
}
</style>
