<template>
  <div class="planner-wrapper">
    <div class="container planner-inner py-5">
      <header class="text-center" :class="store.currentStep > 1 ? 'mb-5' : 'mb-4'">
        <button class="logout-btn" @click="logout">Logout</button>

        <h1 class="display-5 fw-bold mb-3">Maskan Fast-Track Solutions</h1>

        <div class="progress-container mx-auto" style="max-width: 760px">
          <div class="progress-tracker">
            <div class="tracker-inner">
              <div class="tracker-line-bg">
                <div class="tracker-line-fill" :style="{ width: progressLineWidth }"></div>
              </div>

              <div class="tracker-steps">
                <div
                  v-for="(step, index) in steps"
                  :key="step.label"
                  class="tracker-step"
                  :class="{
                    completed: index < store.currentStep - 1,
                    active: index === store.currentStep - 1,
                    upcoming: index >= store.currentStep,
                  }"
                >
                  <div class="tracker-node"></div>
                  <div class="tracker-label">{{ step.label }}</div>
                </div>
              </div>
            </div>

            <div class="tracker-counter">{{ store.currentStep }}/6</div>
          </div>
        </div>
      </header>

      <main class="content-shell">
        <transition name="page-fade" mode="out-in">
          <component :is="currentStepComponent" />
        </transition>

        <div v-if="store.currentStep === 6" class="estimate-feedback">
          <div v-if="store.preview.error" class="alert alert-danger mb-3">
            {{ store.preview.error }}
          </div>
        </div>
      </main>

      <footer class="nav-footer d-flex justify-content-between mt-5 pt-4">
        <button v-if="store.currentStep > 1" @click="store.prevStep" class="btn btn-back">
          <i class="bi bi-arrow-left"></i>
          Previous
        </button>

        <div v-else></div>

        <button
          @click="handleNext"
          class="btn btn-next"
          :disabled="!isStepValid || store.preview.loading"
        >
          <span
            v-if="store.currentStep === 6 && store.preview.loading"
            class="spinner-border spinner-border-sm me-2"
            aria-hidden="true"
          ></span>
          {{ nextButtonLabel }}
          <i v-if="!(store.currentStep === 6 && store.preview.loading)" class="bi bi-arrow-right ms-2"></i>
        </button>
      </footer>
    </div>

    <CustomerDetailsModal
      v-if="showCustomerDetailsModal"
      :loading="store.preview.loading"
      :error="store.preview.error"
      @cancel="closeCustomerDetailsModal"
      @submit="generateEstimate"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

import { resolveTilePriceItemCode, usePlannerStore } from '@/stores/Planner'

import Design from '@/components/Design.vue'
import Ceilings from '@/components/Ceilings.vue'
import Walls from '@/components/Walls.vue'
import Flooring from '@/components/Flooring.vue'
import Furnishing from '@/components/Furnishing.vue'
import AdditionalInput from '@/components/AdditionalInput.vue'
import CustomerDetailsModal from '@/components/CustomerDetailsModal.vue'

const store = usePlannerStore()

const router = useRouter()
const showCustomerDetailsModal = ref(false)

const logout = () => {
  localStorage.removeItem('adminToken')
  localStorage.removeItem('adminUser')

  router.push('/login')
}

const steps = [
  { label: 'Style' },
  { label: 'Ceiling' },
  { label: 'Walls' },
  { label: 'Flooring' },
  { label: 'Furnishing' },
  { label: 'Additional' },
]

const currentStepComponent = computed(() => {
  const stepComponents = [Design, Ceilings, Walls, Flooring, Furnishing, AdditionalInput]
  return stepComponents[store.currentStep - 1]
})

const progressLineWidth = computed(() => {
  const maxSteps = steps.length - 1
  return `${((store.currentStep - 1) / maxSteps) * 100}%`
})

const nextButtonLabel = computed(() => {
  if (store.currentStep !== 6) return 'Next Step'
  return store.preview.loading ? 'Calculating Estimate...' : 'Get Estimate'
})

const isStepValid = computed(() => {
  if (store.currentStep === 1) {
    return !!store.design.style
  }

  if (store.currentStep === 2) {
    const c = store.ceiling
    const m = store.measurements
    const validGypsumCodes = ['CEILING_LEVEL_1', 'CEILING_LEVEL_2']
    const validCornishCodes = ['CORNISH_5CM', 'CORNISH_10CM']
    const validLightCodes = ['LIGHT_TRACK', 'LIGHT_SPOT', 'LIGHT_HIDDEN', 'LIGHT_STRIP']
    const lightsAreValid =
      c.ceilingLights.length > 0 &&
      c.ceilingLights.every(
        (light) =>
          light.enabled &&
          light.priceItemCode !== null &&
          validLightCodes.includes(light.priceItemCode) &&
          light.quantity !== null &&
          light.quantity > 0,
      )

    const chandelierIsValid =
      c.chandelierAnswered &&
      (!c.chandelier.enabled ||
        (c.chandelier.priceItemCode === 'CHANDELIER' &&
          ((c.chandelier.pricingMode === 'Calculated' &&
            c.chandelier.quantity !== null &&
            c.chandelier.quantity > 0) ||
            (c.chandelier.pricingMode === 'Custom' &&
              c.chandelier.customPrice !== null &&
              c.chandelier.customPrice > 0))))

    const curtainBoxIsValid =
      c.curtainBoxAnswered &&
      (!c.curtainBox.enabled ||
        (c.curtainBox.priceItemCode === 'CURTAIN_BOX' &&
          c.curtainBox.length !== null &&
          c.curtainBox.length > 0))

    const ceilingPaintingIsValid =
      c.ceilingPaintingAnswered &&
      c.ceilingPainting.enabled &&
      c.ceilingPainting.priceItemCode === 'CEILING_PAINTING' &&
      !!c.ceilingPainting.paintColour?.trim()

    return (
      m.ceilingArea !== null &&
      m.ceilingArea > 0 &&
      c.gypsumCeiling.enabled &&
      c.gypsumCeiling.priceItemCode !== null &&
      validGypsumCodes.includes(c.gypsumCeiling.priceItemCode) &&
      c.cornish.enabled &&
      c.cornish.priceItemCode !== null &&
      validCornishCodes.includes(c.cornish.priceItemCode) &&
      c.cornish.length !== null &&
      c.cornish.length > 0 &&
      lightsAreValid &&
      chandelierIsValid &&
      curtainBoxIsValid &&
      ceilingPaintingIsValid
    )
  }

  if (store.currentStep === 3) {
    const w = store.walls
    const m = store.measurements
    const validCurtainCodes = ['CURTAIN_CHOICE_1', 'CURTAIN_CHOICE_2']
    const validWallPaintCodes = ['WALL_PAINT_CHOICE_1', 'WALL_PAINT_CHOICE_2']
    const validWallpaperCodes = ['WALLPAPER_CHOICE_1', 'WALLPAPER_CHOICE_2']

    const curtainIsValid =
      w.curtain.enabled &&
      w.curtain.priceItemCode !== null &&
      validCurtainCodes.includes(w.curtain.priceItemCode) &&
      w.curtain.length !== null &&
      w.curtain.length > 0

    const mouldingIsValid =
      w.moulding.enabled &&
      w.moulding.priceItemCode === 'WALL_MOULDING' &&
      w.moulding.length !== null &&
      w.moulding.length > 0

    const wallPaintingIsCalculated = w.wallPainting.pricingMode === 'Calculated'
    const wallPaintingNeedsWallArea = w.wallPainting.enabled && wallPaintingIsCalculated
    const wallpaperNeedsWallArea = w.wallpaper.enabled
    const wallAreaIsValid = m.wallArea !== null && m.wallArea > 0

    const wallPaintingIsValid =
      w.wallPainting.enabled &&
      w.wallPainting.priceItemCode !== null &&
      validWallPaintCodes.includes(w.wallPainting.priceItemCode) &&
      !!w.wallPainting.paintColour?.trim() &&
      ((wallPaintingIsCalculated && wallAreaIsValid) ||
        (w.wallPainting.pricingMode === 'Custom' &&
          w.wallPainting.customPrice !== null &&
          w.wallPainting.customPrice > 0))

    const wallpaperIsValid =
      !w.wallpaper.enabled ||
      (w.wallpaper.priceItemCode !== null &&
        validWallpaperCodes.includes(w.wallpaper.priceItemCode) &&
        wallAreaIsValid)

    const doorsAreValid =
      w.doorsAnswered &&
      (!w.doors.enabled ||
        (w.doors.priceItemCode === 'DOOR_CHANGED' &&
          w.doors.quantity !== null &&
          w.doors.quantity > 0))

    const windowsAreValid =
      w.windowsAnswered &&
      (!w.windows.enabled ||
        (w.windows.priceItemCode === 'WINDOW_CHANGED' &&
          w.windows.quantity !== null &&
          w.windows.quantity > 0))

    const claddingIsValid =
      w.claddingAnswered &&
      (!w.cladding.enabled ||
        (w.cladding.priceItemCode === 'WALL_CLADDING' &&
          w.cladding.area !== null &&
          w.cladding.area > 0))

    const canonicalWallAreaIsValid =
      !(wallPaintingNeedsWallArea || wallpaperNeedsWallArea) || wallAreaIsValid

    return (
      curtainIsValid &&
      mouldingIsValid &&
      wallPaintingIsValid &&
      wallpaperIsValid &&
      doorsAreValid &&
      windowsAreValid &&
      claddingIsValid &&
      canonicalWallAreaIsValid
    )
  }

  if (store.currentStep === 4) {
    const f = store.flooring
    const m = store.measurements
    const validMaterial =
      f.tiles.material === 'Porcelain' || f.tiles.material === 'Marble' || f.tiles.material === 'Granite'
    const validTileSize = f.tiles.tileSize === '60x60' || f.tiles.tileSize === '120x120'
    const resolvedTileCode = resolveTilePriceItemCode(f.tiles.material, f.tiles.tileSize)
    const validSkirtingCodes = ['SKIRTING_10', 'SKIRTING_15']

    const tilesAreValid =
      m.flooringArea !== null &&
      m.flooringArea > 0 &&
      f.tiles.enabled &&
      validMaterial &&
      validTileSize &&
      f.tiles.priceItemCode !== null &&
      f.tiles.priceItemCode === resolvedTileCode

    const skirtingIsValid =
      f.skirting.enabled &&
      f.skirting.priceItemCode !== null &&
      validSkirtingCodes.includes(f.skirting.priceItemCode) &&
      f.skirting.length !== null &&
      f.skirting.length > 0

    const parquetIsValid =
      f.parquetAnswered &&
      (!f.parquet.enabled ||
        (f.parquet.priceItemCode === 'PARQUET' &&
          f.parquet.area !== null &&
          f.parquet.area > 0))

    const glassworkIsValid =
      f.glassworkAnswered &&
      (!f.glasswork.enabled ||
        (f.glasswork.priceItemCode === 'GLASS_WORK' &&
          f.glasswork.area !== null &&
          f.glasswork.area > 0))

    return (
      tilesAreValid &&
      skirtingIsValid &&
      parquetIsValid &&
      glassworkIsValid
    )
  }

  if (store.currentStep === 5) {
    const furn = store.furnishing
    const validBedCodes = ['BED_KING', 'BED_QUEEN']
    const validAcCodes = ['AC_SPLIT', 'AC_CASSETTE']

    const bedIsValid =
      furn.bed.enabled &&
      furn.bed.priceItemCode !== null &&
      validBedCodes.includes(furn.bed.priceItemCode)

    const headboardCladdingIsValid =
      furn.headboardCladdingAnswered &&
      (!furn.headboardCladding.enabled ||
        (furn.headboardCladding.priceItemCode === 'HEADBOARD_CLADDING' &&
          ((furn.headboardCladding.pricingMode === 'Calculated' &&
            furn.headboardCladding.area !== null &&
            furn.headboardCladding.area > 0) ||
            (furn.headboardCladding.pricingMode === 'Custom' &&
              furn.headboardCladding.customPrice !== null &&
              furn.headboardCladding.customPrice > 0))))

    const sideTableIsValid =
      furn.sideTableAnswered &&
      (!furn.sideTable.enabled ||
        (furn.sideTable.priceItemCode === 'SIDE_TABLE' &&
          furn.sideTable.quantity !== null &&
          furn.sideTable.quantity > 0))

    const sideLampsAreValid =
      furn.sideLampsAnswered &&
      (!furn.sideLamps.enabled ||
        (furn.sideLamps.priceItemCode === 'SIDE_LAMP' &&
          furn.sideLamps.quantity !== null &&
          furn.sideLamps.quantity > 0))

    const tvUnitIsValid =
      furn.tvUnitAnswered &&
      (!furn.tvUnit.enabled ||
        (furn.tvUnit.priceItemCode === 'TV_UNIT' &&
          (furn.tvUnit.pricingMode === 'Calculated' ||
            (furn.tvUnit.pricingMode === 'Custom' &&
              furn.tvUnit.customPrice !== null &&
              furn.tvUnit.customPrice > 0))))

    const chairsAreValid =
      furn.chairsAnswered &&
      (!furn.chairs.enabled ||
        (furn.chairs.priceItemCode === 'CHAIR' &&
          furn.chairs.quantity !== null &&
          furn.chairs.quantity > 0))

    const stoolsAreValid =
      furn.stoolsAnswered &&
      (!furn.stools.enabled ||
        (furn.stools.priceItemCode === 'STOOL' &&
          furn.stools.quantity !== null &&
          furn.stools.quantity > 0))

    const dressingTableIsValid =
      furn.dressingTableAnswered &&
      (!furn.dressingTable.enabled || furn.dressingTable.priceItemCode === 'DRESSING_TABLE')

    const carpetIsValid =
      furn.carpetAnswered &&
      (!furn.carpet.enabled ||
        (furn.carpet.priceItemCode === 'CARPET' &&
          furn.carpet.area !== null &&
          furn.carpet.area > 0))

    const benchIsValid =
      furn.benchAnswered && (!furn.bench.enabled || furn.bench.priceItemCode === 'BENCH')

    const acIsValid =
      furn.acAnswered &&
      (!furn.ac.enabled ||
        (furn.ac.priceItemCode !== null &&
          validAcCodes.includes(furn.ac.priceItemCode) &&
          ((furn.ac.pricingMode === 'Calculated' &&
            furn.ac.quantity !== null &&
            furn.ac.quantity > 0) ||
            (furn.ac.pricingMode === 'Custom' &&
              furn.ac.customPrice !== null &&
              furn.ac.customPrice > 0))))

    return (
      bedIsValid &&
      headboardCladdingIsValid &&
      sideTableIsValid &&
      sideLampsAreValid &&
      tvUnitIsValid &&
      chairsAreValid &&
      stoolsAreValid &&
      dressingTableIsValid &&
      carpetIsValid &&
      benchIsValid &&
      acIsValid
    )
  }

  if (store.currentStep === 6) {
    const validCategories = ['Design', 'Ceiling', 'Walls', 'Flooring', 'Furnishing', 'Other']

    return store.additionalRequirements.every(
      (requirement) =>
        validCategories.includes(requirement.category) &&
        requirement.itemName.trim() !== '' &&
        requirement.customPrice !== null &&
        requirement.customPrice > 0,
    )
  }

  return true
})

const handleNext = async () => {
  if (!isStepValid.value) return

  if (store.currentStep === 6) {
    if (store.preview.loading) return
    showCustomerDetailsModal.value = true
  } else {
    store.nextStep()
  }
}

function closeCustomerDetailsModal() {
  if (store.preview.loading) return
  showCustomerDetailsModal.value = false
}

async function generateEstimate(values: {
  projectName: string
  clientName: string
  clientMobile: string
  clientEmail: string
  clientAddress: string
}) {
  if (store.preview.loading) return

  store.projectName = values.projectName
  store.clientName = values.clientName
  store.clientMobile = values.clientMobile
  store.clientEmail = values.clientEmail
  store.clientAddress = values.clientAddress

  await store.previewEstimate()
  if (store.preview.data && !store.preview.error) {
    showCustomerDetailsModal.value = false
    router.push('/estimate-report')
  }
}
</script>

<style scoped>
.planner-wrapper {
  min-height: 100vh;
  background: transparent;
  color: #2c2c2c;
}

.planner-inner {
  max-width: 1080px;
}

.progress-tracker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 0 0.5rem;
}

.logout-btn {
  position: fixed;
  top: 22px;
  right: 28px;
  z-index: 1000;
  padding: 10px 20px;
  border: none;
  border-radius: 999px;
  background: #2c2c2c;
  color: white;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.15);
}

.logout-btn:hover {
  background: #000;
}

.tracker-inner {
  position: relative;
  flex: 1;
  min-width: 0;
}

.tracker-line-bg {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(128, 101, 206, 0.16);
  transform: translateY(-50%);
  border-radius: 999px;
  overflow: hidden;
}

.tracker-line-fill {
  height: 100%;
  width: 0;
  background: #5a2d8a;
  transition: width 0.35s ease;
}

.tracker-steps {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
}

.tracker-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-width: 0;
}

.tracker-node {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid rgba(90, 45, 138, 0.18);
  background: transparent;
  transition: all 0.25s ease;
  box-sizing: border-box;
}

.tracker-step.completed .tracker-node {
  border-color: #5a2d8a;
  background: #5a2d8a;
}

.tracker-step.active .tracker-node {
  width: 24px;
  height: 24px;
  border-width: 4px;
  border-color: #4f2774;
  background: rgba(95, 41, 139, 0.14);
  box-shadow: 0 0 0 3px rgba(79, 39, 116, 0.12);
}

.tracker-step.upcoming .tracker-node {
  border-color: rgba(90, 45, 138, 0.16);
  background: transparent;
  opacity: 0.75;
}

.tracker-label {
  margin-top: 0.75rem;
  font-size: 0.78rem;
  line-height: 1.4;
  letter-spacing: 0.02em;
  color: #6c6c78;
  white-space: nowrap;
}

.tracker-counter {
  flex-shrink: 0;
  color: #2c2c2c;
  font-weight: 700;
  font-size: 0.95rem;
  min-width: 3.5rem;
  text-align: right;
}

.content-shell {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.estimate-feedback {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

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

.btn-next:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.btn-back {
  background: transparent;
  color: #6c757d;
  font-weight: 600;
  border: none;
}

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

@media (max-width: 575.98px) {
  .planner-inner {
    padding-top: 4.5rem !important;
    padding-bottom: 1.5rem !important;
  }

  .progress-tracker {
    flex-direction: row;
    align-items: flex-start;
    gap: 0.45rem;
    padding-top: 0.5rem;
  }

  .tracker-line-bg {
    top: 7px;
  }

  .tracker-node {
    width: 13px;
    height: 13px;
    border-width: 2px;
  }

  .tracker-step.active .tracker-node {
    width: 16px;
    height: 16px;
    border-width: 3px;
    box-shadow: 0 0 0 2px rgba(79, 39, 116, 0.1);
  }

  .tracker-label {
    display: block;
    margin-top: 0.45rem;
    font-size: 0.58rem;
    line-height: 1.15;
    letter-spacing: 0;
  }

  .tracker-counter {
    min-width: 2.25rem;
    text-align: right;
    margin-top: 0;
    font-size: 0.78rem;
    line-height: 1;
    padding-top: 0.18rem;
  }

  .logout-btn {
    top: 16px;
    right: 16px;
    padding: 9px 14px;
    border-radius: 8px;
    font-size: 0.9rem;
  }

  .nav-footer {
    gap: 0.75rem;
    margin-top: 2rem !important;
    padding-top: 0 !important;
  }

  .btn-next,
  .btn-back {
    min-height: 44px;
  }

  .btn-next {
    flex: 1;
    padding-inline: 1rem;
  }
}
</style>
