import { defineStore } from 'pinia'
import { getPriceItems } from '@/services/priceItemApi'
import { previewBedroomProject, saveBedroomProject } from '@/services/projectApi'
import type {
  AdditionalRequirement,
  AdditionalRequirementDraft,
  AreaItem,
  BedroomPreviewResponse,
  CeilingLightItem,
  CustomAreaItem,
  CustomFixedItem,
  CustomQuantityItem,
  FixedItem,
  LengthItem,
  PriceItemResponse,
  PricingMode,
  QuantityItem,
  ReportCategory,
  BedroomPlannerRequest,
  SavedBedroomProjectDetailResponse,
  SavedBedroomProjectResponse,
} from '@/types/bedroomPlanner'

type CeilingLevel = 1 | 2
type CornishSize = 5 | 10
type LightingType = '' | 'Track' | 'Spot' | 'Hidden' | 'Strip'
type WallChoice = '' | 'Choice 1' | 'Choice 2'
type ChangedRetained = '' | 'Changed' | 'Retained'
type FloorMaterial = '' | 'Porcelain' | 'Marble' | 'Granite'
type TileSize = '' | '120x120' | '60x60'
type SkirtingSize = 10 | 15
type BedSize = '' | 'King' | 'Queen'
type AcType = '' | 'Split' | 'Cassette'

interface LegacyPlannerState {
  design?: { style?: string }
  ceiling?: {
    level?: CeilingLevel | null
    manualArea?: number | null
    cornishSize?: CornishSize | null
    cornishLength?: number | null
    lightingType?: LightingType
    lightsCount?: number | null
    hasChandelier?: boolean | null
    chandelierQuantity?: number | null
    hasCurtainBox?: boolean | null
    curtainBoxLength?: number | null
  }
  walls?: {
    curtainChoice?: WallChoice
    curtainLength?: number | null
    manualArea?: number | null
    mouldingLength?: number | null
    wallPainting?: WallChoice
    wallpaper?: WallChoice
    doors?: ChangedRetained
    doorQuantity?: number | null
    windows?: ChangedRetained
    windowQuantity?: number | null
    hasCladding?: boolean | null
    claddingArea?: number | null
  }
  flooring?: {
    material?: FloorMaterial
    manualArea?: number | null
    tileSize?: TileSize
    skirtingSize?: SkirtingSize | null
    skirtingLength?: number | null
    hasParquet?: boolean | null
    parquetArea?: number | null
    hasGlassWork?: boolean | null
    glassWorkArea?: number | null
  }
  furnishing?: {
    bedSize?: BedSize
    hasHeadboard?: boolean
    hasBedsideCladding?: boolean
    bedsideCladdingArea?: number | null
    sideTableChoice?: '' | 'Choice 1'
    sideTableQuantity?: number | null
    hasSideLamps?: boolean | null
    sideLampQuantity?: number | null
    tvUnitChoice?: '' | 'Choice 1'
    chairs?: { exists?: boolean | null; count?: number }
    stools?: { exists?: boolean | null; count?: number }
    hasDressingTable?: boolean | null
    hasCarpet?: boolean | null
    carpetArea?: number | null
    hasBench?: boolean | null
    acType?: AcType
    acQuantity?: number | null
  }
  additional?: {
    hasAdditional?: boolean | null
    notes?: string
    extraPrice?: number | null
  }
}

const DESIGN_CODES: Record<string, string> = {
  Modern: 'DESIGN_MODERN',
  'Neo-Classic': 'DESIGN_NEO_CLASSIC',
  Classic: 'DESIGN_CLASSIC',
}

const DESIGN_STYLES_BY_CODE = Object.fromEntries(
  Object.entries(DESIGN_CODES).map(([style, code]) => [code, style]),
) as Record<string, string>

const LIGHT_CODES: Record<Exclude<LightingType, ''>, string> = {
  Track: 'LIGHT_TRACK',
  Spot: 'LIGHT_SPOT',
  Hidden: 'LIGHT_HIDDEN',
  Strip: 'LIGHT_STRIP',
}

const LIGHT_TYPES_BY_CODE = Object.fromEntries(
  Object.entries(LIGHT_CODES).map(([type, code]) => [code, type]),
) as Record<string, Exclude<LightingType, ''>>

export function resolveTilePriceItemCode(
  material: string | null | undefined,
  tileSize: string | null | undefined,
): string | null {
  if (!material || !tileSize) return null

  const sizeCode = tileSize === '120x120' ? '120' : tileSize === '60x60' ? '60' : null
  if (!sizeCode) return null

  const materialCode = material.toUpperCase()
  if (!['PORCELAIN', 'MARBLE', 'GRANITE'].includes(materialCode)) return null

  return `FLOOR_${materialCode}_${sizeCode}`
}

function fixedItem(): FixedItem {
  return { enabled: false, priceItemCode: null }
}

function quantityItem(): QuantityItem {
  return { enabled: false, priceItemCode: null, quantity: null }
}

function lengthItem(): LengthItem {
  return { enabled: false, priceItemCode: null, length: null }
}

function areaItem(): AreaItem {
  return { enabled: false, priceItemCode: null, area: null }
}

function customFixedItem(): CustomFixedItem {
  return { enabled: false, priceItemCode: null, pricingMode: null, customPrice: null }
}

function customQuantityItem(): CustomQuantityItem {
  return {
    enabled: false,
    priceItemCode: null,
    pricingMode: null,
    quantity: null,
    customPrice: null,
  }
}

function customAreaItem(): CustomAreaItem {
  return {
    enabled: false,
    priceItemCode: null,
    pricingMode: null,
    area: null,
    customPrice: null,
  }
}

function cleanString(value: string | null | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

function positiveOrNull(value: number | null | undefined): number | null {
  return typeof value === 'number' && value > 0 ? value : null
}

function cleanFixed(item: FixedItem): FixedItem {
  return item.enabled
    ? { enabled: true, priceItemCode: item.priceItemCode }
    : { enabled: false, priceItemCode: null }
}

function cleanQuantity(item: QuantityItem): QuantityItem {
  if (!item.enabled) return { enabled: false, priceItemCode: null, quantity: null }
  return {
    enabled: true,
    priceItemCode: item.priceItemCode,
    quantity: positiveOrNull(item.quantity),
  }
}

function cleanLength(item: LengthItem): LengthItem {
  if (!item.enabled) return { enabled: false, priceItemCode: null, length: null }
  return {
    enabled: true,
    priceItemCode: item.priceItemCode,
    length: positiveOrNull(item.length),
  }
}

function cleanArea(item: AreaItem): AreaItem {
  if (!item.enabled) return { enabled: false, priceItemCode: null, area: null }
  return {
    enabled: true,
    priceItemCode: item.priceItemCode,
    area: positiveOrNull(item.area),
  }
}

function cleanCustomFixed(item: CustomFixedItem): CustomFixedItem {
  if (!item.enabled) {
    return { enabled: false, priceItemCode: null, pricingMode: null, customPrice: null }
  }

  const pricingMode: PricingMode = item.pricingMode ?? 'Calculated'
  return {
    enabled: true,
    priceItemCode: item.priceItemCode,
    pricingMode,
    customPrice: pricingMode === 'Custom' ? positiveOrNull(item.customPrice) : null,
  }
}

function cleanCustomQuantity(item: CustomQuantityItem): CustomQuantityItem {
  if (!item.enabled) {
    return {
      enabled: false,
      priceItemCode: null,
      pricingMode: null,
      quantity: null,
      customPrice: null,
    }
  }

  const pricingMode: PricingMode = item.pricingMode ?? 'Calculated'
  return {
    enabled: true,
    priceItemCode: item.priceItemCode,
    pricingMode,
    quantity: pricingMode === 'Calculated' ? positiveOrNull(item.quantity) : null,
    customPrice: pricingMode === 'Custom' ? positiveOrNull(item.customPrice) : null,
  }
}

function cleanCustomArea(item: CustomAreaItem): CustomAreaItem {
  if (!item.enabled) {
    return {
      enabled: false,
      priceItemCode: null,
      pricingMode: null,
      area: null,
      customPrice: null,
    }
  }

  const pricingMode: PricingMode = item.pricingMode ?? 'Calculated'
  return {
    enabled: true,
    priceItemCode: item.priceItemCode,
    pricingMode,
    area: pricingMode === 'Calculated' ? positiveOrNull(item.area) : null,
    customPrice: pricingMode === 'Custom' ? positiveOrNull(item.customPrice) : null,
  }
}

function createAdditionalRequirementDraft(): AdditionalRequirementDraft {
  return {
    id: crypto.randomUUID(),
    category: 'Other',
    itemName: '',
    description: '',
    customPrice: null,
  }
}

function cleanAdditionalRequirement(item: AdditionalRequirementDraft): AdditionalRequirement | null {
  const itemName = item.itemName.trim()
  if (!itemName || !positiveOrNull(item.customPrice)) return null

  return {
    category: item.category,
    itemName,
    description: cleanString(item.description),
    customPrice: positiveOrNull(item.customPrice),
  }
}

function cloneFixedItem(item: FixedItem): FixedItem {
  return {
    enabled: item.enabled,
    priceItemCode: item.priceItemCode,
  }
}

function cloneQuantityItem(item: QuantityItem): QuantityItem {
  return {
    ...cloneFixedItem(item),
    quantity: item.quantity,
  }
}

function cloneLengthItem(item: LengthItem): LengthItem {
  return {
    ...cloneFixedItem(item),
    length: item.length,
  }
}

function cloneAreaItem(item: AreaItem): AreaItem {
  return {
    ...cloneFixedItem(item),
    area: item.area,
  }
}

function cloneCustomFixedItem(item: CustomFixedItem): CustomFixedItem {
  return {
    ...cloneFixedItem(item),
    pricingMode: item.pricingMode,
    customPrice: item.customPrice,
  }
}

function cloneCustomQuantityItem(item: CustomQuantityItem): CustomQuantityItem {
  return {
    ...cloneQuantityItem(item),
    pricingMode: item.pricingMode,
    customPrice: item.customPrice,
  }
}

function cloneCustomAreaItem(item: CustomAreaItem): CustomAreaItem {
  return {
    ...cloneAreaItem(item),
    pricingMode: item.pricingMode,
    customPrice: item.customPrice,
  }
}

function tileDetailsFromCode(code: string | null): { material: FloorMaterial; tileSize: TileSize } {
  const match = code?.match(/^FLOOR_(PORCELAIN|MARBLE|GRANITE)_(60|120)$/)
  if (!match) return { material: '', tileSize: '' }

  const materialCode = match[1]
  const sizeCode = match[2]
  if (!materialCode || !sizeCode) return { material: '', tileSize: '' }

  const material = `${materialCode[0]}${materialCode.slice(1).toLowerCase()}` as FloorMaterial
  const tileSize = sizeCode === '60' ? '60x60' : '120x120'
  return { material, tileSize }
}

function createInitialState() {
  return {
    currentStep: 1,
    schemaVersion: 'bedroom-planner.v2' as const,
    currency: 'QAR' as const,
    projectName: '',
    clientName: '',
    clientMobile: '',
    clientEmail: '',
    clientAddress: '',

    measurements: {
      roomLength: null as number | null,
      roomWidth: null as number | null,
      ceilingArea: null as number | null,
      wallArea: null as number | null,
      flooringArea: null as number | null,
    },

    design: {
      priceItemCode: null as string | null,
      // Temporary compatibility field for the current Design.vue.
      style: '',
    },

    dimensions: {
      // Temporary compatibility fields for current area getters and legacy hydration.
      length: 0,
      width: 0,
    },

    ceiling: {
      gypsumCeiling: fixedItem(),
      cornish: lengthItem(),
      ceilingLights: [] as CeilingLightItem[],
      chandelier: customQuantityItem(),
      curtainBox: lengthItem(),
      ceilingPainting: {
        enabled: true,
        priceItemCode: 'CEILING_PAINTING' as string | null,
        paintColour: 'White' as string | null,
      },
      chandelierAnswered: false,
      curtainBoxAnswered: false,
      ceilingPaintingAnswered: true,

      // Temporary legacy Ceiling fields retained only for older hydration paths.
      level: null as CeilingLevel | null,
      manualArea: null as number | null,
      cornishSize: null as CornishSize | null,
      cornishLength: null as number | null,
      lightingType: '' as LightingType,
      lightsCount: null as number | null,
      hasChandelier: null as boolean | null,
      chandelierQuantity: null as number | null,
      hasCurtainBox: null as boolean | null,
      curtainBoxLength: null as number | null,
    },

    walls: {
      curtain: lengthItem(),
      moulding: lengthItem(),
      wallPainting: {
        enabled: false,
        priceItemCode: null as string | null,
        pricingMode: null as PricingMode | null,
        customPrice: null as number | null,
        paintColour: null as string | null,
      },
      wallpaper: fixedItem(),
      doors: quantityItem(),
      windows: quantityItem(),
      cladding: areaItem(),
      doorsAnswered: false,
      windowsAnswered: false,
      claddingAnswered: false,

      // Temporary compatibility fields used by the current Walls.vue.
      curtainChoice: '' as WallChoice,
      curtainLength: null as number | null,
      manualArea: null as number | null,
      mouldingLength: null as number | null,
      ceilingPainting: 'White',
      wallPaintingChoice: '' as WallChoice,
      wallpaperChoice: '' as WallChoice,
      doorsChoice: '' as ChangedRetained,
      doorQuantity: null as number | null,
      windowsChoice: '' as ChangedRetained,
      windowQuantity: null as number | null,
      hasCladding: null as boolean | null,
      claddingArea: null as number | null,
    },

    flooring: {
      tiles: {
        enabled: false,
        priceItemCode: null as string | null,
        material: null as string | null,
        tileSize: null as string | null,
      },
      skirting: lengthItem(),
      parquet: areaItem(),
      glasswork: areaItem(),
      parquetAnswered: false,
      glassworkAnswered: false,

      // Temporary compatibility fields retained for legacy hydration and unrelated migration phases.
      material: '' as FloorMaterial,
      manualArea: null as number | null,
      tileSize: '' as TileSize,
      skirtingSize: null as SkirtingSize | null,
      skirtingLength: null as number | null,
      hasParquet: null as boolean | null,
      parquetArea: null as number | null,
      hasGlassWork: null as boolean | null,
      glassWorkArea: null as number | null,
    },

    furnishing: {
      bed: fixedItem(),
      headboardCladding: customAreaItem(),
      sideTable: quantityItem(),
      sideLamps: quantityItem(),
      tvUnit: customFixedItem(),
      chairs: quantityItem(),
      stools: quantityItem(),
      dressingTable: fixedItem(),
      carpet: areaItem(),
      bench: fixedItem(),
      ac: customQuantityItem(),
      headboardCladdingAnswered: false,
      sideTableAnswered: false,
      sideLampsAnswered: false,
      tvUnitAnswered: false,
      chairsAnswered: false,
      stoolsAnswered: false,
      dressingTableAnswered: false,
      carpetAnswered: false,
      benchAnswered: false,
      acAnswered: false,

      // Temporary compatibility fields retained for legacy hydration and unrelated migration phases.
      bedSize: '' as BedSize,
      hasHeadboard: false,
      hasBedsideCladding: false,
      bedsideCladdingArea: null as number | null,
      sideTableChoice: '' as '' | 'Choice 1',
      sideTableQuantity: null as number | null,
      hasSideLamps: null as boolean | null,
      sideLampQuantity: null as number | null,
      tvUnitChoice: '' as '' | 'Choice 1',
      chairsLegacy: {
        exists: null as boolean | null,
        count: 0,
      },
      stoolsLegacy: {
        exists: null as boolean | null,
        count: 0,
      },
      hasDressingTable: null as boolean | null,
      hasCarpet: null as boolean | null,
      carpetArea: null as number | null,
      hasBench: null as boolean | null,
      acType: '' as AcType,
      acQuantity: null as number | null,
    },

    additionalRequirements: [] as AdditionalRequirementDraft[],

    additional: {
      // Temporary compatibility fields retained for legacy hydration.
      hasAdditional: null as boolean | null,
      notes: '',
      extraPrice: null as number | null,
      finishLevel: 2 as 1 | 2 | 3,
    },

    catalogue: {
      items: [] as PriceItemResponse[],
      loading: false,
      error: null as string | null,
    },

    preview: {
      data: null as BedroomPreviewResponse | null,
      loading: false,
      error: null as string | null,
      isStale: false,
    },

    save: {
      data: null as SavedBedroomProjectResponse | null,
      loading: false,
      error: null as string | null,
      completed: false,
    },
  }
}

export const usePlannerStore = defineStore('planner', {
  state: createInitialState,

  getters: {
    calculatedBaseArea: (state) => {
      return state.dimensions.length * state.dimensions.width
    },

    displayFloorArea(): number {
      if (this.measurements.flooringArea !== null && this.measurements.flooringArea > 0) {
        return this.measurements.flooringArea
      }

      if (this.flooring.manualArea !== null && this.flooring.manualArea > 0) {
        return this.flooring.manualArea
      }

      return this.calculatedBaseArea
    },

    displayCeilingArea(): number {
      if (this.measurements.ceilingArea !== null && this.measurements.ceilingArea > 0) {
        return this.measurements.ceilingArea
      }

      if (this.ceiling.manualArea !== null && this.ceiling.manualArea > 0) {
        return this.ceiling.manualArea
      }

      return this.calculatedBaseArea
    },

    calculateLinearMeters: (state) => {
      return 2 * (state.dimensions.length + state.dimensions.width)
    },

    progressPercentage: (state) => (state.currentStep / 6) * 100,
  },

  actions: {
    setDesignStyle(style: string) {
      this.design.style = style
      this.design.priceItemCode = DESIGN_CODES[style] ?? null
    },

    setCeilingLevel(level: CeilingLevel) {
      this.ceiling.level = level
      this.ceiling.gypsumCeiling = {
        enabled: true,
        priceItemCode: `CEILING_LEVEL_${level}`,
      }
    },

    nextStep() {
      if (this.currentStep < 6) this.currentStep++
    },

    prevStep() {
      if (this.currentStep === 6 && this.preview.data) {
        this.markPreviewStale()
      }

      if (this.currentStep > 1) this.currentStep--
    },

    markPreviewStale() {
      if (this.preview.data) {
        this.preview.isStale = true
      }

      this.save.data = null
      this.save.error = null
      this.save.completed = false
    },

    addAdditionalRequirement() {
      this.markPreviewStale()
      this.additionalRequirements.push(createAdditionalRequirementDraft())
    },

    removeAdditionalRequirement(index: number) {
      this.markPreviewStale()
      this.additionalRequirements.splice(index, 1)
    },

    updateAdditionalRequirement(
      index: number,
      changes: Partial<Omit<AdditionalRequirementDraft, 'id'>>,
    ) {
      const existing = this.additionalRequirements[index]
      if (!existing) return

      this.markPreviewStale()
      this.additionalRequirements[index] = {
        ...existing,
        ...changes,
      }
    },

    async fetchPriceItems() {
      if (this.catalogue.loading) return

      this.catalogue.loading = true
      this.catalogue.error = null

      try {
        this.catalogue.items = await getPriceItems()
      } catch (error) {
        this.catalogue.error = error instanceof Error ? error.message : 'Unable to load price items.'
      } finally {
        this.catalogue.loading = false
      }
    },

    buildPreviewPayload(): BedroomPlannerRequest {
      const ceilingArea = positiveOrNull(this.measurements.ceilingArea)
      const wallArea = positiveOrNull(this.measurements.wallArea)
      const flooringArea = positiveOrNull(this.measurements.flooringArea)

      const ceilingLights = this.ceiling.ceilingLights
        .filter((light) => light.enabled)
        .map((light) => cleanQuantity(light))

      const additionalRequirements = this.additionalRequirements
        .map((item) => cleanAdditionalRequirement(item))
        .filter((item): item is AdditionalRequirement => item !== null)

      return {
        schemaVersion: this.schemaVersion,
        projectName: this.projectName.trim() || 'Bedroom Planner Estimate',
        clientName: this.clientName.trim() || 'Walk-in Client',
        clientMobile: cleanString(this.clientMobile),
        currency: this.currency,
        measurements: {
          roomLength: positiveOrNull(this.measurements.roomLength) ?? positiveOrNull(this.dimensions.length),
          roomWidth: positiveOrNull(this.measurements.roomWidth) ?? positiveOrNull(this.dimensions.width),
          ceilingArea,
          wallArea,
          flooringArea,
        },
        design: {
          priceItemCode: this.design.priceItemCode ?? DESIGN_CODES[this.design.style] ?? null,
        },
        ceiling: {
          gypsumCeiling: cleanFixed(this.ceiling.gypsumCeiling),
          cornish: cleanLength(this.ceiling.cornish),
          ceilingLights,
          chandelier: cleanCustomQuantity(this.ceiling.chandelier),
          curtainBox: cleanLength(this.ceiling.curtainBox),
          ceilingPainting: {
            ...cleanFixed({
              enabled: this.ceiling.ceilingPainting.enabled,
              priceItemCode: this.ceiling.ceilingPainting.priceItemCode,
            }),
            paintColour: cleanString(this.ceiling.ceilingPainting.paintColour),
          },
        },
        walls: {
          curtain: cleanLength(this.walls.curtain),
          moulding: cleanLength(this.walls.moulding),
          wallPainting: {
            ...cleanCustomFixed(this.walls.wallPainting),
            paintColour: cleanString(this.walls.wallPainting.paintColour),
          },
          wallpaper: cleanFixed(this.walls.wallpaper),
          doors: cleanQuantity(this.walls.doors),
          windows: cleanQuantity(this.walls.windows),
          cladding: cleanArea(this.walls.cladding),
        },
        flooring: {
          tiles: {
            ...cleanFixed({
              enabled: this.flooring.tiles.enabled,
              priceItemCode: resolveTilePriceItemCode(
                this.flooring.tiles.material,
                this.flooring.tiles.tileSize,
              ),
            }),
            material: cleanString(this.flooring.tiles.material),
            tileSize: cleanString(this.flooring.tiles.tileSize),
          },
          skirting: cleanLength(this.flooring.skirting),
          parquet: cleanArea(this.flooring.parquet),
          glasswork: cleanArea(this.flooring.glasswork),
        },
        furnishing: {
          bed: cleanFixed(this.furnishing.bed),
          headboardCladding: cleanCustomArea(this.furnishing.headboardCladding),
          sideTable: cleanQuantity(this.furnishing.sideTable),
          sideLamps: cleanQuantity(this.furnishing.sideLamps),
          tvUnit: cleanCustomFixed(this.furnishing.tvUnit),
          chairs: cleanQuantity(this.furnishing.chairs),
          stools: cleanQuantity(this.furnishing.stools),
          dressingTable: cleanFixed(this.furnishing.dressingTable),
          carpet: cleanArea(this.furnishing.carpet),
          bench: cleanFixed(this.furnishing.bench),
          ac: cleanCustomQuantity(this.furnishing.ac),
        },
        additionalRequirements,
      }
    },

    async previewEstimate() {
      if (this.preview.loading) return

      this.preview.loading = true
      this.preview.error = null
      this.preview.data = null
      this.preview.isStale = false

      try {
        this.preview.data = await previewBedroomProject(this.buildPreviewPayload())
        this.preview.isStale = false
      } catch (error) {
        this.preview.error = error instanceof Error ? error.message : 'Unable to preview estimate.'
      } finally {
        this.preview.loading = false
      }
    },

    async saveProject() {
      if (this.save.loading) return

      this.save.error = null

      if (!this.preview.data) {
        this.save.error = 'Generate an estimate before saving the project.'
        return
      }

      if (this.preview.isStale) {
        this.save.error = 'Recalculate the estimate before saving the project.'
        return
      }

      this.save.loading = true

      try {
        const payload = {
          projectName: this.projectName.trim(),
          customerName: this.clientName.trim(),
          customerPhone: cleanString(this.clientMobile),
          customerEmail: cleanString(this.clientEmail),
          customerAddress: cleanString(this.clientAddress),
          plannerRequest: this.buildPreviewPayload(),
        }

        this.save.data = await saveBedroomProject(payload)
        this.save.completed = true
      } catch (error) {
        this.save.error = error instanceof Error ? error.message : 'Unable to save bedroom project.'
        this.save.completed = false
      } finally {
        this.save.loading = false
      }
    },

    loadDuplicateProject(savedProject: SavedBedroomProjectDetailResponse) {
      const request = savedProject.plannerRequest
      if (!request) {
        throw new Error('This saved project does not include a planner snapshot to duplicate.')
      }

      const nextState = createInitialState()
      const projectName = savedProject.projectName.trim() || request.projectName.trim() || 'Bedroom Planner Estimate'
      const tileDetails = tileDetailsFromCode(request.flooring.tiles.priceItemCode)
      const material = (request.flooring.tiles.material as FloorMaterial | null) || tileDetails.material
      const tileSize = (request.flooring.tiles.tileSize as TileSize | null) || tileDetails.tileSize
      const firstLight = request.ceiling.ceilingLights.find((light) => light.enabled)

      nextState.currentStep = 1
      nextState.schemaVersion = request.schemaVersion
      nextState.currency = request.currency
      nextState.projectName = `${projectName} Copy`
      nextState.clientName = savedProject.customerName.trim() || request.clientName
      nextState.clientMobile = savedProject.customerPhone ?? request.clientMobile ?? ''
      nextState.clientEmail = savedProject.customerEmail ?? ''
      nextState.clientAddress = savedProject.customerAddress ?? ''

      nextState.measurements = {
        roomLength: request.measurements.roomLength,
        roomWidth: request.measurements.roomWidth,
        ceilingArea: request.measurements.ceilingArea,
        wallArea: request.measurements.wallArea,
        flooringArea: request.measurements.flooringArea,
      }
      nextState.dimensions.length = request.measurements.roomLength ?? 0
      nextState.dimensions.width = request.measurements.roomWidth ?? 0

      nextState.design.priceItemCode = request.design.priceItemCode
      nextState.design.style = request.design.priceItemCode
        ? DESIGN_STYLES_BY_CODE[request.design.priceItemCode] ?? ''
        : ''

      nextState.ceiling.gypsumCeiling = cloneFixedItem(request.ceiling.gypsumCeiling)
      nextState.ceiling.cornish = cloneLengthItem(request.ceiling.cornish)
      nextState.ceiling.ceilingLights = request.ceiling.ceilingLights.map((light) => ({
        enabled: light.enabled,
        priceItemCode: light.priceItemCode,
        quantity: light.quantity,
      }))
      nextState.ceiling.chandelier = cloneCustomQuantityItem(request.ceiling.chandelier)
      nextState.ceiling.curtainBox = cloneLengthItem(request.ceiling.curtainBox)
      nextState.ceiling.ceilingPainting = {
        enabled: request.ceiling.ceilingPainting.enabled,
        priceItemCode: request.ceiling.ceilingPainting.priceItemCode,
        paintColour: request.ceiling.ceilingPainting.paintColour,
      }
      nextState.ceiling.chandelierAnswered = true
      nextState.ceiling.curtainBoxAnswered = true
      nextState.ceiling.ceilingPaintingAnswered = true
      nextState.ceiling.level =
        request.ceiling.gypsumCeiling.priceItemCode === 'CEILING_LEVEL_1'
          ? 1
          : request.ceiling.gypsumCeiling.priceItemCode === 'CEILING_LEVEL_2'
            ? 2
            : null
      nextState.ceiling.manualArea = request.measurements.ceilingArea
      nextState.ceiling.cornishSize =
        request.ceiling.cornish.priceItemCode === 'CORNISH_5CM'
          ? 5
          : request.ceiling.cornish.priceItemCode === 'CORNISH_10CM'
            ? 10
            : null
      nextState.ceiling.cornishLength = request.ceiling.cornish.length
      nextState.ceiling.lightingType = firstLight?.priceItemCode
        ? LIGHT_TYPES_BY_CODE[firstLight.priceItemCode] ?? ''
        : ''
      nextState.ceiling.lightsCount = firstLight?.quantity ?? null
      nextState.ceiling.hasChandelier = request.ceiling.chandelier.enabled
      nextState.ceiling.chandelierQuantity = request.ceiling.chandelier.quantity
      nextState.ceiling.hasCurtainBox = request.ceiling.curtainBox.enabled
      nextState.ceiling.curtainBoxLength = request.ceiling.curtainBox.length

      nextState.walls.curtain = cloneLengthItem(request.walls.curtain)
      nextState.walls.moulding = cloneLengthItem(request.walls.moulding)
      nextState.walls.wallPainting = {
        ...cloneCustomFixedItem(request.walls.wallPainting),
        paintColour: request.walls.wallPainting.paintColour,
      }
      nextState.walls.wallpaper = cloneFixedItem(request.walls.wallpaper)
      nextState.walls.doors = cloneQuantityItem(request.walls.doors)
      nextState.walls.windows = cloneQuantityItem(request.walls.windows)
      nextState.walls.cladding = cloneAreaItem(request.walls.cladding)
      nextState.walls.doorsAnswered = true
      nextState.walls.windowsAnswered = true
      nextState.walls.claddingAnswered = true
      nextState.walls.curtainChoice =
        request.walls.curtain.priceItemCode === 'CURTAIN_CHOICE_1'
          ? 'Choice 1'
          : request.walls.curtain.priceItemCode === 'CURTAIN_CHOICE_2'
            ? 'Choice 2'
            : ''
      nextState.walls.curtainLength = request.walls.curtain.length
      nextState.walls.manualArea = request.measurements.wallArea
      nextState.walls.mouldingLength = request.walls.moulding.length
      nextState.walls.ceilingPainting = request.ceiling.ceilingPainting.paintColour ?? 'White'
      nextState.walls.wallPaintingChoice =
        request.walls.wallPainting.priceItemCode === 'WALL_PAINT_CHOICE_1'
          ? 'Choice 1'
          : request.walls.wallPainting.priceItemCode === 'WALL_PAINT_CHOICE_2'
            ? 'Choice 2'
            : ''
      nextState.walls.wallpaperChoice =
        request.walls.wallpaper.priceItemCode === 'WALLPAPER_CHOICE_1'
          ? 'Choice 1'
          : request.walls.wallpaper.priceItemCode === 'WALLPAPER_CHOICE_2'
            ? 'Choice 2'
            : ''
      nextState.walls.doorsChoice = request.walls.doors.enabled ? 'Changed' : 'Retained'
      nextState.walls.doorQuantity = request.walls.doors.quantity
      nextState.walls.windowsChoice = request.walls.windows.enabled ? 'Changed' : 'Retained'
      nextState.walls.windowQuantity = request.walls.windows.quantity
      nextState.walls.hasCladding = request.walls.cladding.enabled
      nextState.walls.claddingArea = request.walls.cladding.area

      nextState.flooring.tiles = {
        enabled: request.flooring.tiles.enabled,
        priceItemCode: request.flooring.tiles.priceItemCode,
        material: material || null,
        tileSize: tileSize || null,
      }
      nextState.flooring.skirting = cloneLengthItem(request.flooring.skirting)
      nextState.flooring.parquet = cloneAreaItem(request.flooring.parquet)
      nextState.flooring.glasswork = cloneAreaItem(request.flooring.glasswork)
      nextState.flooring.parquetAnswered = true
      nextState.flooring.glassworkAnswered = true
      nextState.flooring.material = material
      nextState.flooring.manualArea = request.measurements.flooringArea
      nextState.flooring.tileSize = tileSize
      nextState.flooring.skirtingSize =
        request.flooring.skirting.priceItemCode === 'SKIRTING_10'
          ? 10
          : request.flooring.skirting.priceItemCode === 'SKIRTING_15'
            ? 15
            : null
      nextState.flooring.skirtingLength = request.flooring.skirting.length
      nextState.flooring.hasParquet = request.flooring.parquet.enabled
      nextState.flooring.parquetArea = request.flooring.parquet.area
      nextState.flooring.hasGlassWork = request.flooring.glasswork.enabled
      nextState.flooring.glassWorkArea = request.flooring.glasswork.area

      nextState.furnishing.bed = cloneFixedItem(request.furnishing.bed)
      nextState.furnishing.headboardCladding = cloneCustomAreaItem(request.furnishing.headboardCladding)
      nextState.furnishing.sideTable = cloneQuantityItem(request.furnishing.sideTable)
      nextState.furnishing.sideLamps = cloneQuantityItem(request.furnishing.sideLamps)
      nextState.furnishing.tvUnit = cloneCustomFixedItem(request.furnishing.tvUnit)
      nextState.furnishing.chairs = cloneQuantityItem(request.furnishing.chairs)
      nextState.furnishing.stools = cloneQuantityItem(request.furnishing.stools)
      nextState.furnishing.dressingTable = cloneFixedItem(request.furnishing.dressingTable)
      nextState.furnishing.carpet = cloneAreaItem(request.furnishing.carpet)
      nextState.furnishing.bench = cloneFixedItem(request.furnishing.bench)
      nextState.furnishing.ac = cloneCustomQuantityItem(request.furnishing.ac)
      nextState.furnishing.headboardCladdingAnswered = true
      nextState.furnishing.sideTableAnswered = true
      nextState.furnishing.sideLampsAnswered = true
      nextState.furnishing.tvUnitAnswered = true
      nextState.furnishing.chairsAnswered = true
      nextState.furnishing.stoolsAnswered = true
      nextState.furnishing.dressingTableAnswered = true
      nextState.furnishing.carpetAnswered = true
      nextState.furnishing.benchAnswered = true
      nextState.furnishing.acAnswered = true
      nextState.furnishing.bedSize =
        request.furnishing.bed.priceItemCode === 'BED_KING'
          ? 'King'
          : request.furnishing.bed.priceItemCode === 'BED_QUEEN'
            ? 'Queen'
            : ''
      nextState.furnishing.hasHeadboard = request.furnishing.headboardCladding.enabled
      nextState.furnishing.hasBedsideCladding = request.furnishing.headboardCladding.enabled
      nextState.furnishing.bedsideCladdingArea = request.furnishing.headboardCladding.area
      nextState.furnishing.sideTableChoice = request.furnishing.sideTable.enabled ? 'Choice 1' : ''
      nextState.furnishing.sideTableQuantity = request.furnishing.sideTable.quantity
      nextState.furnishing.hasSideLamps = request.furnishing.sideLamps.enabled
      nextState.furnishing.sideLampQuantity = request.furnishing.sideLamps.quantity
      nextState.furnishing.tvUnitChoice = request.furnishing.tvUnit.enabled ? 'Choice 1' : ''
      nextState.furnishing.chairsLegacy = {
        exists: request.furnishing.chairs.enabled,
        count: request.furnishing.chairs.quantity ?? 0,
      }
      nextState.furnishing.stoolsLegacy = {
        exists: request.furnishing.stools.enabled,
        count: request.furnishing.stools.quantity ?? 0,
      }
      nextState.furnishing.hasDressingTable = request.furnishing.dressingTable.enabled
      nextState.furnishing.hasCarpet = request.furnishing.carpet.enabled
      nextState.furnishing.carpetArea = request.furnishing.carpet.area
      nextState.furnishing.hasBench = request.furnishing.bench.enabled
      nextState.furnishing.acType =
        request.furnishing.ac.priceItemCode === 'AC_SPLIT'
          ? 'Split'
          : request.furnishing.ac.priceItemCode === 'AC_CASSETTE'
            ? 'Cassette'
            : ''
      nextState.furnishing.acQuantity = request.furnishing.ac.quantity

      nextState.additionalRequirements = request.additionalRequirements.map((item) => ({
        id: crypto.randomUUID(),
        category: item.category,
        itemName: item.itemName,
        description: item.description,
        customPrice: item.customPrice,
      }))

      nextState.preview = {
        data: null,
        loading: false,
        error: null,
        isStale: false,
      }
      nextState.save = {
        data: null,
        loading: false,
        error: null,
        completed: false,
      }

      this.$patch(nextState)
    },

    clearPreview() {
      this.preview.data = null
      this.preview.error = null
      this.preview.isStale = false
    },

    hydrateFromLegacy(legacy: LegacyPlannerState) {
      if (legacy.design?.style) this.setDesignStyle(legacy.design.style)

      if (legacy.ceiling) {
        const c = legacy.ceiling
        if (c.level) this.setCeilingLevel(c.level)
        this.measurements.ceilingArea = c.manualArea ?? this.measurements.ceilingArea
        if (c.lightingType && c.lightsCount) {
          this.ceiling.ceilingLights = [
            {
              enabled: true,
              priceItemCode: LIGHT_CODES[c.lightingType],
              quantity: c.lightsCount,
            },
          ]
        }
        if (c.hasChandelier === true) {
          this.ceiling.chandelier = {
            enabled: true,
            priceItemCode: 'CHANDELIER',
            pricingMode: 'Calculated',
            quantity: c.chandelierQuantity ?? null,
            customPrice: null,
          }
        }
      }

      if (legacy.walls) {
        const w = legacy.walls
        this.measurements.wallArea = w.manualArea ?? this.measurements.wallArea
      }

      if (legacy.flooring) {
        const f = legacy.flooring
        this.measurements.flooringArea = f.manualArea ?? this.measurements.flooringArea
      }

      if (legacy.furnishing) {
        const furn = legacy.furnishing
        if (furn.hasHeadboard || furn.hasBedsideCladding) {
          this.furnishing.headboardCladding = {
            enabled: true,
            priceItemCode: 'HEADBOARD_CLADDING',
            pricingMode: 'Calculated',
            area: furn.bedsideCladdingArea ?? null,
            customPrice: null,
          }
        }
      }

      if (
        legacy.additional?.hasAdditional &&
        (legacy.additional.notes?.trim() || positiveOrNull(legacy.additional.extraPrice))
      ) {
        this.additionalRequirements = [
          {
            id: crypto.randomUUID(),
            category: 'Other' as ReportCategory,
            itemName: legacy.additional.notes?.trim() || 'Additional requirement',
            description: legacy.additional.notes?.trim() || null,
            customPrice: positiveOrNull(legacy.additional.extraPrice),
          },
        ]
      }
    },

    resetPlanner() {
      this.$patch(createInitialState())
    },
  },
})
