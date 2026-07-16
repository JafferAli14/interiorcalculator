<template>
  <div class="furnishing-step">
    <header class="step-header text-center mb-4">
      <h2 class="page-title mb-2 text-dark fw-bold">Room Furnishing</h2>
      <p class="text-muted fs-6 mb-0">Select bed setup and furniture options for the bedroom.</p>
    </header>

    <div class="inputs-stack">
      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">1. Bed Size</h3>
        <p class="text-muted small mb-3">Choose the bed size.</p>

        <div class="image-option-grid two">
          <div
            v-for="option in bedOptions"
            :key="option.code"
            class="image-option-cell"
            @click="selectBed(option.code)"
          >
            <StyleCard
              compact
              :name="option.name"
              :description="option.description"
              :image="option.image"
              :is-selected="store.furnishing.bed.priceItemCode === option.code"
            />
          </div>
        </div>
      </section>

      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">2. Headboard/Cladding</h3>
        <p class="text-muted small mb-3">Choose whether to include headboard or bedside cladding work.</p>

        <div class="option-grid two mb-4">
          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.furnishing.headboardCladding.enabled }"
            @click="selectHeadboardCladding(true)"
          >
            <span class="choice-icon">Y</span>
            <strong>Yes</strong>
            <small>Add headboard/cladding</small>
          </button>

          <button
            type="button"
            class="choice-card"
            :class="{
              selected:
                store.furnishing.headboardCladdingAnswered &&
                !store.furnishing.headboardCladding.enabled,
            }"
            @click="selectHeadboardCladding(false)"
          >
            <span class="choice-icon">N</span>
            <strong>No</strong>
            <small>No headboard/cladding</small>
          </button>
        </div>

        <template v-if="store.furnishing.headboardCladding.enabled">
          <div class="option-grid two mb-4">
            <button
              type="button"
              class="choice-card"
              :class="{ selected: store.furnishing.headboardCladding.pricingMode === 'Calculated' }"
              @click="setHeadboardCladdingMode('Calculated')"
            >
              <span class="choice-icon">=</span>
              <strong>Calculated</strong>
              <small>Use cladding area</small>
            </button>

            <button
              type="button"
              class="choice-card"
              :class="{ selected: store.furnishing.headboardCladding.pricingMode === 'Custom' }"
              @click="setHeadboardCladdingMode('Custom')"
            >
              <span class="choice-icon">Q</span>
              <strong>Custom</strong>
              <small>Enter manual price</small>
            </button>
          </div>

          <div
            v-if="store.furnishing.headboardCladding.pricingMode === 'Calculated'"
            class="row"
          >
            <div class="col-12 col-md-9 col-lg-7">
              <label class="form-label small fw-bold text-muted mb-2">Headboard/Cladding Area</label>
              <div
                class="input-group input-group-lg border rounded-3 overflow-hidden shadow-sm custom-focus-within"
              >
                <input
                  v-model.number="store.furnishing.headboardCladding.area"
                  type="number"
                  class="form-control border-0 px-3"
                  placeholder="Ex: 60"
                  min="1"
                />
                <span class="input-group-text bg-white border-0 text-muted fw-bold pe-4">
                  sq ft
                </span>
              </div>
            </div>
          </div>

          <div v-if="store.furnishing.headboardCladding.pricingMode === 'Custom'" class="row">
            <div class="col-12 col-md-9 col-lg-7">
              <label class="form-label small fw-bold text-muted mb-2">Custom Price</label>
              <div
                class="input-group input-group-lg border rounded-3 overflow-hidden shadow-sm custom-focus-within"
              >
                <input
                  v-model.number="store.furnishing.headboardCladding.customPrice"
                  type="number"
                  class="form-control border-0 px-3"
                  placeholder="Ex: 2500"
                  min="1"
                />
                <span class="input-group-text bg-white border-0 text-muted fw-bold pe-4">
                  QAR
                </span>
              </div>
            </div>
          </div>
        </template>
      </section>

      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">3. Side Table</h3>
        <p class="text-muted small mb-3">Choose whether to include side tables.</p>

        <div class="option-grid two mb-4">
          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.furnishing.sideTable.enabled }"
            @click="selectSideTable(true)"
          >
            <span class="choice-icon">Y</span>
            <strong>Yes</strong>
            <small>Add side tables</small>
          </button>

          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.furnishing.sideTableAnswered && !store.furnishing.sideTable.enabled }"
            @click="selectSideTable(false)"
          >
            <span class="choice-icon">N</span>
            <strong>No</strong>
            <small>No side tables</small>
          </button>
        </div>

        <div v-if="store.furnishing.sideTable.enabled" class="row">
          <div class="col-12 col-md-9 col-lg-7">
            <label class="form-label small fw-bold text-muted mb-2">Side Table Quantity</label>
            <input
              v-model.number="store.furnishing.sideTable.quantity"
              type="number"
              class="form-control form-control-lg rounded-3 shadow-sm"
              placeholder="Ex: 2"
              min="1"
            />
          </div>
        </div>
      </section>

      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">4. Side Lamps</h3>
        <p class="text-muted small mb-3">Choose whether to include side lamps.</p>

        <div class="option-grid two mb-4">
          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.furnishing.sideLamps.enabled }"
            @click="selectSideLamps(true)"
          >
            <span class="choice-icon">Y</span>
            <strong>Yes</strong>
            <small>Add side lamps</small>
          </button>

          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.furnishing.sideLampsAnswered && !store.furnishing.sideLamps.enabled }"
            @click="selectSideLamps(false)"
          >
            <span class="choice-icon">N</span>
            <strong>No</strong>
            <small>No side lamps</small>
          </button>
        </div>

        <div v-if="store.furnishing.sideLamps.enabled" class="row">
          <div class="col-12 col-md-9 col-lg-7">
            <label class="form-label small fw-bold text-muted mb-2">Side Lamp Quantity</label>
            <input
              v-model.number="store.furnishing.sideLamps.quantity"
              type="number"
              class="form-control form-control-lg rounded-3 shadow-sm"
              placeholder="Ex: 2"
              min="1"
            />
          </div>
        </div>
      </section>

      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">5. TV Unit</h3>
        <p class="text-muted small mb-3">Choose whether to include a TV unit.</p>

        <div class="option-grid two mb-4">
          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.furnishing.tvUnit.enabled }"
            @click="selectTvUnit(true)"
          >
            <span class="choice-icon">Y</span>
            <strong>Yes</strong>
            <small>Add TV unit</small>
          </button>

          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.furnishing.tvUnitAnswered && !store.furnishing.tvUnit.enabled }"
            @click="selectTvUnit(false)"
          >
            <span class="choice-icon">N</span>
            <strong>No</strong>
            <small>No TV unit</small>
          </button>
        </div>

        <template v-if="store.furnishing.tvUnit.enabled">
          <div class="image-option-grid one mb-4">
            <div class="image-option-cell">
              <StyleCard
                compact
                name="TV Unit"
                description="Selected TV unit"
                :image="tvUnitImg"
                :is-selected="store.furnishing.tvUnit.priceItemCode === 'TV_UNIT'"
              />
            </div>
          </div>

          <div class="option-grid two mb-4">
            <button
              type="button"
              class="choice-card"
              :class="{ selected: store.furnishing.tvUnit.pricingMode === 'Calculated' }"
              @click="setTvUnitMode('Calculated')"
            >
              <span class="choice-icon">=</span>
              <strong>Calculated</strong>
              <small>Use catalogue price</small>
            </button>

            <button
              type="button"
              class="choice-card"
              :class="{ selected: store.furnishing.tvUnit.pricingMode === 'Custom' }"
              @click="setTvUnitMode('Custom')"
            >
              <span class="choice-icon">Q</span>
              <strong>Custom</strong>
              <small>Enter manual price</small>
            </button>
          </div>

          <div v-if="store.furnishing.tvUnit.pricingMode === 'Custom'" class="row">
            <div class="col-12 col-md-9 col-lg-7">
              <label class="form-label small fw-bold text-muted mb-2">Custom Price</label>
              <div
                class="input-group input-group-lg border rounded-3 overflow-hidden shadow-sm custom-focus-within"
              >
                <input
                  v-model.number="store.furnishing.tvUnit.customPrice"
                  type="number"
                  class="form-control border-0 px-3"
                  placeholder="Ex: 3500"
                  min="1"
                />
                <span class="input-group-text bg-white border-0 text-muted fw-bold pe-4">
                  QAR
                </span>
              </div>
            </div>
          </div>
        </template>
      </section>

      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">6. Chairs</h3>
        <p class="text-muted small mb-3">Choose whether to include chairs.</p>

        <div class="option-grid two mb-4">
          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.furnishing.chairs.enabled }"
            @click="selectChairs(true)"
          >
            <span class="choice-icon">Y</span>
            <strong>Yes</strong>
            <small>Add chairs</small>
          </button>

          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.furnishing.chairsAnswered && !store.furnishing.chairs.enabled }"
            @click="selectChairs(false)"
          >
            <span class="choice-icon">N</span>
            <strong>No</strong>
            <small>No chairs</small>
          </button>
        </div>

        <div v-if="store.furnishing.chairs.enabled" class="row">
          <div class="col-12 col-md-9 col-lg-7">
            <label class="form-label small fw-bold text-muted mb-2">Number of Chairs</label>
            <input
              v-model.number="store.furnishing.chairs.quantity"
              type="number"
              class="form-control form-control-lg rounded-3 shadow-sm"
              placeholder="Ex: 2"
              min="1"
            />
          </div>
        </div>
      </section>

      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">7. Stools</h3>
        <p class="text-muted small mb-3">Choose whether to include stools.</p>

        <div class="option-grid two mb-4">
          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.furnishing.stools.enabled }"
            @click="selectStools(true)"
          >
            <span class="choice-icon">Y</span>
            <strong>Yes</strong>
            <small>Add stools</small>
          </button>

          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.furnishing.stoolsAnswered && !store.furnishing.stools.enabled }"
            @click="selectStools(false)"
          >
            <span class="choice-icon">N</span>
            <strong>No</strong>
            <small>No stools</small>
          </button>
        </div>

        <div v-if="store.furnishing.stools.enabled" class="row">
          <div class="col-12 col-md-9 col-lg-7">
            <label class="form-label small fw-bold text-muted mb-2">Number of Stools</label>
            <input
              v-model.number="store.furnishing.stools.quantity"
              type="number"
              class="form-control form-control-lg rounded-3 shadow-sm"
              placeholder="Ex: 2"
              min="1"
            />
          </div>
        </div>
      </section>

      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">8. Dressing Table</h3>
        <p class="text-muted small mb-3">Choose whether to include a dressing table.</p>

        <div class="option-grid two">
          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.furnishing.dressingTable.enabled }"
            @click="selectDressingTable(true)"
          >
            <span class="choice-icon">Y</span>
            <strong>Yes</strong>
            <small>Add dressing table</small>
          </button>

          <button
            type="button"
            class="choice-card"
            :class="{
              selected:
                store.furnishing.dressingTableAnswered &&
                !store.furnishing.dressingTable.enabled,
            }"
            @click="selectDressingTable(false)"
          >
            <span class="choice-icon">N</span>
            <strong>No</strong>
            <small>No dressing table</small>
          </button>
        </div>
      </section>

      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">9. Carpet</h3>
        <p class="text-muted small mb-3">Choose whether to include a carpet.</p>

        <div class="option-grid two mb-4">
          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.furnishing.carpet.enabled }"
            @click="selectCarpet(true)"
          >
            <span class="choice-icon">Y</span>
            <strong>Yes</strong>
            <small>Add carpet</small>
          </button>

          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.furnishing.carpetAnswered && !store.furnishing.carpet.enabled }"
            @click="selectCarpet(false)"
          >
            <span class="choice-icon">N</span>
            <strong>No</strong>
            <small>No carpet</small>
          </button>
        </div>

        <div v-if="store.furnishing.carpet.enabled" class="row">
          <div class="col-12 col-md-9 col-lg-7">
            <label class="form-label small fw-bold text-muted mb-2">Carpet Area</label>
            <div
              class="input-group input-group-lg border rounded-3 overflow-hidden shadow-sm custom-focus-within"
            >
              <input
                v-model.number="store.furnishing.carpet.area"
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

      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">10. Bench</h3>
        <p class="text-muted small mb-3">Bench placed at the foot of the bed.</p>

        <div class="option-grid two">
          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.furnishing.bench.enabled }"
            @click="selectBench(true)"
          >
            <span class="choice-icon">Y</span>
            <strong>Yes</strong>
            <small>Add bench</small>
          </button>

          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.furnishing.benchAnswered && !store.furnishing.bench.enabled }"
            @click="selectBench(false)"
          >
            <span class="choice-icon">N</span>
            <strong>No</strong>
            <small>No bench</small>
          </button>
        </div>
      </section>

      <section class="input-block">
        <h3 class="input-block-title h6 fw-bold mb-1">11. A/C</h3>
        <p class="text-muted small mb-3">Choose whether to include air conditioning.</p>

        <div class="option-grid two mb-4">
          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.furnishing.ac.enabled }"
            @click="selectAc(true)"
          >
            <span class="choice-icon">Y</span>
            <strong>Yes</strong>
            <small>Add A/C</small>
          </button>

          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.furnishing.acAnswered && !store.furnishing.ac.enabled }"
            @click="selectAc(false)"
          >
            <span class="choice-icon">N</span>
            <strong>No</strong>
            <small>No A/C</small>
          </button>
        </div>

        <template v-if="store.furnishing.ac.enabled">
          <div class="image-option-grid two mb-4">
            <div
              v-for="option in acOptions"
              :key="option.code"
              class="image-option-cell"
              @click="selectAcType(option.code)"
            >
              <StyleCard
                compact
                :name="option.name"
                :description="option.description"
                :image="option.image"
                :is-selected="store.furnishing.ac.priceItemCode === option.code"
              />
            </div>
          </div>

          <div class="option-grid two mb-4">
            <button
              type="button"
              class="choice-card"
              :class="{ selected: store.furnishing.ac.pricingMode === 'Calculated' }"
              @click="setAcMode('Calculated')"
            >
              <span class="choice-icon">=</span>
              <strong>Calculated</strong>
              <small>Use quantity</small>
            </button>

            <button
              type="button"
              class="choice-card"
              :class="{ selected: store.furnishing.ac.pricingMode === 'Custom' }"
              @click="setAcMode('Custom')"
            >
              <span class="choice-icon">Q</span>
              <strong>Custom</strong>
              <small>Enter manual price</small>
            </button>
          </div>

          <div v-if="store.furnishing.ac.pricingMode === 'Calculated'" class="row">
            <div class="col-12 col-md-9 col-lg-7">
              <label class="form-label small fw-bold text-muted mb-2">A/C Quantity</label>
              <input
                v-model.number="store.furnishing.ac.quantity"
                type="number"
                class="form-control form-control-lg rounded-3 shadow-sm"
                placeholder="Ex: 1"
                min="1"
              />
            </div>
          </div>

          <div v-if="store.furnishing.ac.pricingMode === 'Custom'" class="row">
            <div class="col-12 col-md-9 col-lg-7">
              <label class="form-label small fw-bold text-muted mb-2">Custom Price</label>
              <div
                class="input-group input-group-lg border rounded-3 overflow-hidden shadow-sm custom-focus-within"
              >
                <input
                  v-model.number="store.furnishing.ac.customPrice"
                  type="number"
                  class="form-control border-0 px-3"
                  placeholder="Ex: 4500"
                  min="1"
                />
                <span class="input-group-text bg-white border-0 text-muted fw-bold pe-4">
                  QAR
                </span>
              </div>
            </div>
          </div>
        </template>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import kingBedImg from '@/assets/Furnishing/king-bed.png'
import queenBedImg from '@/assets/Furnishing/queen-bed.png'
import StyleCard from '@/components/StyleCard.vue'
import tvUnitImg from '@/assets/Furnishing/tv-unit.png'
import splitAcImg from '@/assets/Furnishing/split-ac.png'
import cassetteImg from '@/assets/Furnishing/cassette.png'
import { usePlannerStore } from '@/stores/Planner'
import type { PricingMode } from '@/types/bedroomPlanner'

const store = usePlannerStore()

type BedCode = 'BED_KING' | 'BED_QUEEN'
type AcCode = 'AC_SPLIT' | 'AC_CASSETTE'

const bedOptions = [
  {
    code: 'BED_KING' as const,
    name: 'King Size',
    description: 'Larger premium bed setup',
    image: kingBedImg,
  },
  {
    code: 'BED_QUEEN' as const,
    name: 'Queen Size',
    description: 'Compact comfortable bed setup',
    image: queenBedImg,
  },
]

const acOptions = [
  {
    code: 'AC_SPLIT' as const,
    name: 'Split A/C',
    description: 'Wall mounted system',
    image: splitAcImg,
  },
  {
    code: 'AC_CASSETTE' as const,
    name: 'Cassette A/C',
    description: 'Ceiling mounted system',
    image: cassetteImg,
  },
]

function selectBed(code: BedCode) {
  store.furnishing.bed = {
    enabled: true,
    priceItemCode: code,
  }
}

function selectHeadboardCladding(enabled: boolean) {
  store.furnishing.headboardCladdingAnswered = true
  store.furnishing.headboardCladding = enabled
    ? {
        enabled: true,
        priceItemCode: 'HEADBOARD_CLADDING',
        pricingMode: store.furnishing.headboardCladding.pricingMode ?? 'Calculated',
        area: store.furnishing.headboardCladding.area,
        customPrice: store.furnishing.headboardCladding.customPrice,
      }
    : {
        enabled: false,
        priceItemCode: null,
        pricingMode: null,
        area: null,
        customPrice: null,
      }
}

function setHeadboardCladdingMode(pricingMode: PricingMode) {
  store.furnishing.headboardCladding.pricingMode = pricingMode
  store.furnishing.headboardCladding.priceItemCode = 'HEADBOARD_CLADDING'
  if (pricingMode === 'Calculated') {
    store.furnishing.headboardCladding.customPrice = null
  } else {
    store.furnishing.headboardCladding.area = null
  }
}

function selectSideTable(enabled: boolean) {
  store.furnishing.sideTableAnswered = true
  store.furnishing.sideTable = enabled
    ? {
        enabled: true,
        priceItemCode: 'SIDE_TABLE',
        quantity: store.furnishing.sideTable.quantity ?? 1,
      }
    : {
        enabled: false,
        priceItemCode: null,
        quantity: null,
      }
}

function selectSideLamps(enabled: boolean) {
  store.furnishing.sideLampsAnswered = true
  store.furnishing.sideLamps = enabled
    ? {
        enabled: true,
        priceItemCode: 'SIDE_LAMP',
        quantity: store.furnishing.sideLamps.quantity ?? 1,
      }
    : {
        enabled: false,
        priceItemCode: null,
        quantity: null,
      }
}

function selectTvUnit(enabled: boolean) {
  store.furnishing.tvUnitAnswered = true
  store.furnishing.tvUnit = enabled
    ? {
        enabled: true,
        priceItemCode: 'TV_UNIT',
        pricingMode: store.furnishing.tvUnit.pricingMode ?? 'Calculated',
        customPrice: store.furnishing.tvUnit.customPrice,
      }
    : {
        enabled: false,
        priceItemCode: null,
        pricingMode: null,
        customPrice: null,
      }
}

function setTvUnitMode(pricingMode: PricingMode) {
  store.furnishing.tvUnit.pricingMode = pricingMode
  store.furnishing.tvUnit.priceItemCode = 'TV_UNIT'
  if (pricingMode === 'Calculated') {
    store.furnishing.tvUnit.customPrice = null
  }
}

function selectChairs(enabled: boolean) {
  store.furnishing.chairsAnswered = true
  store.furnishing.chairs = enabled
    ? {
        enabled: true,
        priceItemCode: 'CHAIR',
        quantity: store.furnishing.chairs.quantity ?? 1,
      }
    : {
        enabled: false,
        priceItemCode: null,
        quantity: null,
      }
}

function selectStools(enabled: boolean) {
  store.furnishing.stoolsAnswered = true
  store.furnishing.stools = enabled
    ? {
        enabled: true,
        priceItemCode: 'STOOL',
        quantity: store.furnishing.stools.quantity ?? 1,
      }
    : {
        enabled: false,
        priceItemCode: null,
        quantity: null,
      }
}

function selectDressingTable(enabled: boolean) {
  store.furnishing.dressingTableAnswered = true
  store.furnishing.dressingTable = enabled
    ? {
        enabled: true,
        priceItemCode: 'DRESSING_TABLE',
      }
    : {
        enabled: false,
        priceItemCode: null,
      }
}

function selectCarpet(enabled: boolean) {
  store.furnishing.carpetAnswered = true
  store.furnishing.carpet = enabled
    ? {
        enabled: true,
        priceItemCode: 'CARPET',
        area: store.furnishing.carpet.area ?? 1,
      }
    : {
        enabled: false,
        priceItemCode: null,
        area: null,
      }
}

function selectBench(enabled: boolean) {
  store.furnishing.benchAnswered = true
  store.furnishing.bench = enabled
    ? {
        enabled: true,
        priceItemCode: 'BENCH',
      }
    : {
        enabled: false,
        priceItemCode: null,
      }
}

function selectAc(enabled: boolean) {
  store.furnishing.acAnswered = true
  store.furnishing.ac = enabled
    ? {
        enabled: true,
        priceItemCode: store.furnishing.ac.priceItemCode,
        pricingMode: store.furnishing.ac.pricingMode ?? 'Calculated',
        quantity: store.furnishing.ac.quantity,
        customPrice: store.furnishing.ac.customPrice,
      }
    : {
        enabled: false,
        priceItemCode: null,
        pricingMode: null,
        quantity: null,
        customPrice: null,
      }
}

function selectAcType(code: AcCode) {
  store.furnishing.acAnswered = true
  store.furnishing.ac.enabled = true
  store.furnishing.ac.priceItemCode = code
  store.furnishing.ac.pricingMode = store.furnishing.ac.pricingMode ?? 'Calculated'
  if (store.furnishing.ac.pricingMode === 'Calculated') {
    store.furnishing.ac.quantity = store.furnishing.ac.quantity ?? 1
  }
}

function setAcMode(pricingMode: PricingMode) {
  store.furnishing.ac.pricingMode = pricingMode
  if (pricingMode === 'Calculated') {
    store.furnishing.ac.customPrice = null
    store.furnishing.ac.quantity = store.furnishing.ac.quantity ?? 1
  } else {
    store.furnishing.ac.quantity = null
  }
}
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
