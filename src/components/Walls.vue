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
        <p class="text-muted small mb-3">
          Choose the curtain option and enter total curtain length.
        </p>

        <div class="image-option-grid two mb-4">
          <div
            v-for="option in curtainOptions"
            :key="option.value"
            class="image-option-cell"
            @click="selectCurtain(option.value)"
          >
            <StyleCard
              compact
              :name="option.name"
              :description="option.description"
              :image="option.image"
              :is-selected="store.walls.curtain.priceItemCode === option.value"
            />
          </div>
        </div>

        <div class="row">
          <div class="col-12 col-md-9 col-lg-7">
            <label class="form-label small fw-bold text-muted mb-2">Curtain Length</label>
            <div
              class="input-group input-group-lg border rounded-3 overflow-hidden shadow-sm custom-focus-within"
            >
              <input
                v-model.number="store.walls.curtain.length"
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
                v-model.number="store.measurements.wallArea"
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
                v-model.number="store.walls.moulding.length"
                @input="syncMoulding"
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

      <!-- 4. Wall Painting -->
      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">4. Wall Painting</h3>
        <p class="text-muted small mb-3">Choose the wall painting option.</p>

        <div class="image-option-grid two mb-4">
          <div
            v-for="option in wallPaintingOptions"
            :key="option.value"
            class="image-option-cell"
            @click="selectWallPainting(option.value)"
          >
            <StyleCard
              compact
              :name="option.name"
              :description="option.description"
              :image="option.image"
              :is-selected="store.walls.wallPainting.priceItemCode === option.value"
            />
          </div>
        </div>

        <div class="option-grid two mb-4">
          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.walls.wallPainting.pricingMode === 'Calculated' }"
            @click="setWallPaintingMode('Calculated')"
          >
            <span class="choice-icon">=</span>
            <strong>Calculated</strong>
            <small>Use wall area and selected paint rate</small>
          </button>

          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.walls.wallPainting.pricingMode === 'Custom' }"
            @click="setWallPaintingMode('Custom')"
          >
            <span class="choice-icon">Q</span>
            <strong>Custom</strong>
            <small>Enter manual wall-painting price</small>
          </button>
        </div>

        <div class="row g-3">
          <div class="col-12 col-md-6">
            <label class="form-label small fw-bold text-muted mb-2">Paint Colour</label>
            <input
              v-model.trim="store.walls.wallPainting.paintColour"
              type="text"
              class="form-control form-control-lg rounded-3 shadow-sm"
              placeholder="Ex: Ivory"
            />
          </div>

          <div v-if="store.walls.wallPainting.pricingMode === 'Custom'" class="col-12 col-md-6">
            <label class="form-label small fw-bold text-muted mb-2">Custom Price (QAR)</label>
            <input
              v-model.number="store.walls.wallPainting.customPrice"
              type="number"
              class="form-control form-control-lg rounded-3 shadow-sm"
              placeholder="Ex: 18000"
              min="1"
            />
          </div>
        </div>
      </section>

      <!-- 5. Wallpaper -->
      <section class="input-block">
        <h3 class="input-block-title h6 fw-bold mb-1">5. Wallpaper</h3>
        <p class="text-muted small mb-3">Choose the wallpaper option.</p>

        <div class="image-option-grid two">
          <div
            v-for="option in wallpaperOptions"
            :key="option.value"
            class="image-option-cell"
            @click="selectWallpaper(option.value)"
          >
            <StyleCard
              compact
              :name="option.name"
              :description="option.description"
              :image="option.image"
              :is-selected="store.walls.wallpaper.priceItemCode === option.value"
            />
          </div>
        </div>
      </section>

      <!-- 6. Doors -->
      <section class="input-block mt-4 mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">6. Doors</h3>
        <p class="text-muted small mb-3">Will the doors be changed or retained?</p>

        <div class="image-option-grid two mb-4">
          <div
            v-for="option in doorOptions"
            :key="option.value"
            class="image-option-cell"
            @click="selectDoors(option.value)"
          >
            <StyleCard
              compact
              :name="option.name"
              :description="option.description"
              :image="option.image"
              :is-selected="doorSelection === option.value"
            />
          </div>
        </div>

        <div v-if="store.walls.doors.enabled" class="row">
          <div class="col-12 col-md-9 col-lg-7">
            <label class="form-label small fw-bold text-muted mb-2">Door Quantity</label>
            <input
              v-model.number="store.walls.doors.quantity"
              type="number"
              class="form-control form-control-lg rounded-3 shadow-sm"
              placeholder="Ex: 1"
              min="1"
            />
          </div>
        </div>
      </section>

      <!-- 7. Windows -->
      <section class="input-block mb-4 pb-4 border-bottom">
        <h3 class="input-block-title h6 fw-bold mb-1">7. Windows</h3>
        <p class="text-muted small mb-3">Will the windows be changed or retained?</p>

        <div class="image-option-grid two mb-4">
          <div
            v-for="option in windowOptions"
            :key="option.value"
            class="image-option-cell"
            @click="selectWindows(option.value)"
          >
            <StyleCard
              compact
              :name="option.name"
              :description="option.description"
              :image="option.image"
              :is-selected="windowSelection === option.value"
            />
          </div>
        </div>

        <div v-if="store.walls.windows.enabled" class="row">
          <div class="col-12 col-md-9 col-lg-7">
            <label class="form-label small fw-bold text-muted mb-2">Window Quantity</label>
            <input
              v-model.number="store.walls.windows.quantity"
              type="number"
              class="form-control form-control-lg rounded-3 shadow-sm"
              placeholder="Ex: 2"
              min="1"
            />
          </div>
        </div>
      </section>

      <!-- 8. Cladding -->
      <section class="input-block">
        <h3 class="input-block-title h6 fw-bold mb-1">8. Cladding</h3>
        <p class="text-muted small mb-3">Does the room require wall cladding?</p>

        <div class="option-grid two mb-4">
          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.walls.cladding.enabled }"
            @click="selectCladding(true)"
          >
            <span class="choice-icon">Y</span>
            <strong>Yes</strong>
            <small>Add wall cladding</small>
          </button>

          <button
            type="button"
            class="choice-card"
            :class="{ selected: store.walls.claddingAnswered && !store.walls.cladding.enabled }"
            @click="selectCladding(false)"
          >
            <span class="choice-icon">N</span>
            <strong>No</strong>
            <small>No wall cladding</small>
          </button>
        </div>

        <div v-if="store.walls.cladding.enabled" class="row">
          <div class="col-12 col-md-9 col-lg-7">
            <label class="form-label small fw-bold text-muted mb-2">Cladding Area</label>
            <div
              class="input-group input-group-lg border rounded-3 overflow-hidden shadow-sm custom-focus-within"
            >
              <input
                v-model.number="store.walls.cladding.area"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import curtains1Img from '@/assets/walls/curtains1.png'
import curtains2Img from '@/assets/walls/curtains2.png'
import wallPainting1Img from '@/assets/walls/wallpainting1.png'
import wallPainting2Img from '@/assets/walls/wallpainting2.png'
import wallpaper1Img from '@/assets/walls/wallpaper1.png'
import wallpaper2Img from '@/assets/walls/wallpaper2.png'
import StyleCard from '@/components/StyleCard.vue'
import doorsChangedImg from '@/assets/walls/doors-changed.png'
import doorsRetainedImg from '@/assets/walls/doors-retained.png'
import windowsChangedImg from '@/assets/walls/windows-changed.png'
import windowsRetainedImg from '@/assets/walls/windows-retained.png'
import { usePlannerStore } from '@/stores/Planner'
import type { PricingMode } from '@/types/bedroomPlanner'

const store = usePlannerStore()

const curtainOptions = [
  {
    value: 'CURTAIN_CHOICE_1' as const,
    name: 'Choice 1',
    description: 'Standard curtain option',
    image: curtains1Img,
  },
  {
    value: 'CURTAIN_CHOICE_2' as const,
    name: 'Choice 2',
    description: 'Premium curtain option',
    image: curtains2Img,
  },
]

const wallPaintingOptions = [
  {
    value: 'WALL_PAINT_CHOICE_1' as const,
    name: 'Choice 1',
    description: 'Standard wall paint',
    image: wallPainting1Img,
  },
  {
    value: 'WALL_PAINT_CHOICE_2' as const,
    name: 'Choice 2',
    description: 'Premium wall paint',
    image: wallPainting2Img,
  },
]

const wallpaperOptions = [
  {
    value: 'WALLPAPER_CHOICE_1' as const,
    name: 'Choice 1',
    description: 'Standard wallpaper',
    image: wallpaper1Img,
  },
  {
    value: 'WALLPAPER_CHOICE_2' as const,
    name: 'Choice 2',
    description: 'Premium wallpaper',
    image: wallpaper2Img,
  },
]

const doorOptions = [
  {
    value: 'Changed' as const,
    name: 'New Door',
    description: 'Replace existing doors',
    image: doorsChangedImg,
  },
  {
    value: 'Retained' as const,
    name: 'Retain Door',
    description: 'Keep existing doors',
    image: doorsRetainedImg,
  },
]

const windowOptions = [
  {
    value: 'Changed' as const,
    name: 'New Window',
    description: 'Replace existing windows',
    image: windowsChangedImg,
  },
  {
    value: 'Retained' as const,
    name: 'Retain Window',
    description: 'Keep existing windows',
    image: windowsRetainedImg,
  },
]

const doorSelection = computed(() =>
  store.walls.doorsAnswered ? (store.walls.doors.enabled ? 'Changed' : 'Retained') : '',
)
const windowSelection = computed(() =>
  store.walls.windowsAnswered ? (store.walls.windows.enabled ? 'Changed' : 'Retained') : '',
)

function selectCurtain(code: 'CURTAIN_CHOICE_1' | 'CURTAIN_CHOICE_2') {
  store.walls.curtain.enabled = true
  store.walls.curtain.priceItemCode = code
}

function syncMoulding() {
  const length = store.walls.moulding.length
  store.walls.moulding.enabled = typeof length === 'number' && length > 0
  store.walls.moulding.priceItemCode = store.walls.moulding.enabled ? 'WALL_MOULDING' : null
}

function selectWallPainting(code: 'WALL_PAINT_CHOICE_1' | 'WALL_PAINT_CHOICE_2') {
  store.walls.wallPainting.enabled = true
  store.walls.wallPainting.priceItemCode = code
  store.walls.wallPainting.pricingMode = store.walls.wallPainting.pricingMode ?? 'Calculated'
}

function setWallPaintingMode(mode: PricingMode) {
  store.walls.wallPainting.enabled = true
  store.walls.wallPainting.pricingMode = mode
  if (mode === 'Calculated') {
    store.walls.wallPainting.customPrice = null
  }
}

function selectWallpaper(code: 'WALLPAPER_CHOICE_1' | 'WALLPAPER_CHOICE_2') {
  store.walls.wallpaper.enabled = true
  store.walls.wallpaper.priceItemCode = code
}

function selectDoors(value: 'Changed' | 'Retained') {
  store.walls.doorsAnswered = true
  if (value === 'Changed') {
    store.walls.doors.enabled = true
    store.walls.doors.priceItemCode = 'DOOR_CHANGED'
    store.walls.doors.quantity = store.walls.doors.quantity || 1
    return
  }

  store.walls.doors.enabled = false
  store.walls.doors.priceItemCode = null
  store.walls.doors.quantity = null
}

function selectWindows(value: 'Changed' | 'Retained') {
  store.walls.windowsAnswered = true
  if (value === 'Changed') {
    store.walls.windows.enabled = true
    store.walls.windows.priceItemCode = 'WINDOW_CHANGED'
    store.walls.windows.quantity = store.walls.windows.quantity || 1
    return
  }

  store.walls.windows.enabled = false
  store.walls.windows.priceItemCode = null
  store.walls.windows.quantity = null
}

function selectCladding(enabled: boolean) {
  store.walls.claddingAnswered = true
  store.walls.cladding.enabled = enabled
  store.walls.cladding.priceItemCode = enabled ? 'WALL_CLADDING' : null
  store.walls.cladding.area = enabled ? store.walls.cladding.area || 1 : null
}
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

.image-option-grid {
  display: grid;
  gap: 1rem;
}

.image-option-grid.two {
  grid-template-columns: repeat(2, minmax(0, 1fr));
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

  .option-grid.two,
  .image-option-grid.two {
    grid-template-columns: 1fr;
  }
}
</style>
