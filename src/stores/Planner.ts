import { defineStore } from 'pinia'
import { getPriceItems } from '@/services/priceItemApi'
import { previewBedroomProject } from '@/services/projectApi'
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

const LIGHT_CODES: Record<Exclude<LightingType, ''>, string> = {
  Track: 'LIGHT_TRACK',
  Spot: 'LIGHT_SPOT',
  Hidden: 'LIGHT_HIDDEN',
  Strip: 'LIGHT_STRIP',
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

function cleanAdditionalRequirement(
  item: AdditionalRequirementDraft,
  index: number,
): AdditionalRequirement | null {
  const itemName = item.itemName.trim()
  if (!itemName || !positiveOrNull(item.customPrice)) return null

  return {
    category: item.category,
    itemName,
    description: cleanString(item.description),
    customPrice: positiveOrNull(item.customPrice),
    sortOrder: index + 1,
  }
}

function createInitialState() {
  return {
    currentStep: 1,
    schemaVersion: 'bedroom-planner.v2' as const,
    currency: 'QAR' as const,
    projectName: '',
    clientName: '',
    clientMobile: '',

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

      // Temporary compatibility fields used by the current Flooring.vue.
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

      // Temporary compatibility fields used by the current Furnishing.vue.
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
      // Temporary compatibility fields used by the current AdditionalInput.vue.
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
      if (this.currentStep > 1) this.currentStep--
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
      const wallArea = positiveOrNull(this.measurements.wallArea) ?? positiveOrNull(this.walls.manualArea)
      const flooringArea =
        positiveOrNull(this.measurements.flooringArea) ?? positiveOrNull(this.flooring.manualArea)

      const ceilingLights = this.ceiling.ceilingLights
        .filter((light) => light.enabled)
        .map((light) => cleanQuantity(light))

      const additionalRequirements = this.additionalRequirements
        .map(cleanAdditionalRequirement)
        .filter((item): item is AdditionalRequirement => item !== null)

      if (
        additionalRequirements.length === 0 &&
        this.additional.hasAdditional === true &&
        (this.additional.notes.trim() || positiveOrNull(this.additional.extraPrice))
      ) {
        additionalRequirements.push({
          category: 'Other',
          itemName: this.additional.notes.trim() || 'Additional requirement',
          description: this.additional.notes.trim() || null,
          customPrice: positiveOrNull(this.additional.extraPrice),
          sortOrder: 1,
        })
      }

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
          curtain: cleanLength({
            enabled: this.walls.curtain.enabled || this.walls.curtainChoice !== '',
            priceItemCode:
              this.walls.curtain.priceItemCode ??
              (this.walls.curtainChoice ? `CURTAIN_${this.walls.curtainChoice.replace(' ', '_')}` : null),
            length: this.walls.curtain.length ?? this.walls.curtainLength,
          }),
          moulding: cleanLength({
            enabled: this.walls.moulding.enabled || positiveOrNull(this.walls.mouldingLength) !== null,
            priceItemCode: this.walls.moulding.priceItemCode ?? 'WALL_MOULDING',
            length: this.walls.moulding.length ?? this.walls.mouldingLength,
          }),
          wallPainting: {
            ...cleanCustomFixed({
              enabled: this.walls.wallPainting.enabled || this.walls.wallPaintingChoice !== '',
              priceItemCode:
                this.walls.wallPainting.priceItemCode ??
                (this.walls.wallPaintingChoice
                  ? `WALL_PAINTING_${this.walls.wallPaintingChoice.replace(' ', '_')}`
                  : null),
              pricingMode:
                this.walls.wallPainting.pricingMode ??
                (this.walls.wallPaintingChoice ? 'Calculated' : null),
              customPrice: this.walls.wallPainting.customPrice,
            }),
            paintColour: cleanString(this.walls.wallPainting.paintColour),
          },
          wallpaper: cleanFixed({
            enabled: this.walls.wallpaper.enabled || this.walls.wallpaperChoice !== '',
            priceItemCode:
              this.walls.wallpaper.priceItemCode ??
              (this.walls.wallpaperChoice ? `WALLPAPER_${this.walls.wallpaperChoice.replace(' ', '_')}` : null),
          }),
          doors: cleanQuantity({
            enabled: this.walls.doors.enabled || this.walls.doorsChoice === 'Changed',
            priceItemCode: this.walls.doors.priceItemCode ?? 'DOORS',
            quantity: this.walls.doors.quantity ?? this.walls.doorQuantity,
          }),
          windows: cleanQuantity({
            enabled: this.walls.windows.enabled || this.walls.windowsChoice === 'Changed',
            priceItemCode: this.walls.windows.priceItemCode ?? 'WINDOWS',
            quantity: this.walls.windows.quantity ?? this.walls.windowQuantity,
          }),
          cladding: cleanArea({
            enabled: this.walls.cladding.enabled || this.walls.hasCladding === true,
            priceItemCode: this.walls.cladding.priceItemCode ?? 'WALL_CLADDING',
            area: this.walls.cladding.area ?? this.walls.claddingArea,
          }),
        },
        flooring: {
          tiles: {
            ...cleanFixed({
              enabled: this.flooring.tiles.enabled || this.flooring.material !== '',
              priceItemCode:
                this.flooring.tiles.priceItemCode ??
                (this.flooring.material && this.flooring.tileSize
                  ? `TILES_${this.flooring.material}_${this.flooring.tileSize}`.toUpperCase()
                  : null),
            }),
            material: cleanString(this.flooring.tiles.material ?? this.flooring.material),
            tileSize: cleanString(this.flooring.tiles.tileSize ?? this.flooring.tileSize),
          },
          skirting: cleanLength({
            enabled: this.flooring.skirting.enabled || this.flooring.skirtingSize !== null,
            priceItemCode:
              this.flooring.skirting.priceItemCode ??
              (this.flooring.skirtingSize ? `SKIRTING_${this.flooring.skirtingSize}CM` : null),
            length: this.flooring.skirting.length ?? this.flooring.skirtingLength,
          }),
          parquet: cleanArea({
            enabled: this.flooring.parquet.enabled || this.flooring.hasParquet === true,
            priceItemCode: this.flooring.parquet.priceItemCode ?? 'PARQUET',
            area: this.flooring.parquet.area ?? this.flooring.parquetArea,
          }),
          glasswork: cleanArea({
            enabled: this.flooring.glasswork.enabled || this.flooring.hasGlassWork === true,
            priceItemCode: this.flooring.glasswork.priceItemCode ?? 'GLASSWORK',
            area: this.flooring.glasswork.area ?? this.flooring.glassWorkArea,
          }),
        },
        furnishing: {
          bed: cleanFixed({
            enabled: this.furnishing.bed.enabled || this.furnishing.bedSize !== '',
            priceItemCode:
              this.furnishing.bed.priceItemCode ??
              (this.furnishing.bedSize ? `BED_${this.furnishing.bedSize}`.toUpperCase() : null),
          }),
          headboardCladding: cleanCustomArea({
            enabled:
              this.furnishing.headboardCladding.enabled ||
              this.furnishing.hasHeadboard ||
              this.furnishing.hasBedsideCladding,
            priceItemCode: this.furnishing.headboardCladding.priceItemCode ?? 'HEADBOARD_CLADDING',
            pricingMode:
              this.furnishing.headboardCladding.pricingMode ??
              (this.furnishing.hasHeadboard || this.furnishing.hasBedsideCladding ? 'Calculated' : null),
            area: this.furnishing.headboardCladding.area ?? this.furnishing.bedsideCladdingArea,
            customPrice: this.furnishing.headboardCladding.customPrice,
          }),
          sideTable: cleanQuantity({
            enabled: this.furnishing.sideTable.enabled || this.furnishing.sideTableChoice !== '',
            priceItemCode: this.furnishing.sideTable.priceItemCode ?? 'SIDE_TABLE',
            quantity: this.furnishing.sideTable.quantity ?? this.furnishing.sideTableQuantity,
          }),
          sideLamps: cleanQuantity({
            enabled: this.furnishing.sideLamps.enabled || this.furnishing.hasSideLamps === true,
            priceItemCode: this.furnishing.sideLamps.priceItemCode ?? 'SIDE_LAMPS',
            quantity: this.furnishing.sideLamps.quantity ?? this.furnishing.sideLampQuantity,
          }),
          tvUnit: cleanCustomFixed({
            enabled: this.furnishing.tvUnit.enabled || this.furnishing.tvUnitChoice !== '',
            priceItemCode: this.furnishing.tvUnit.priceItemCode ?? 'TV_UNIT',
            pricingMode:
              this.furnishing.tvUnit.pricingMode ??
              (this.furnishing.tvUnitChoice ? 'Calculated' : null),
            customPrice: this.furnishing.tvUnit.customPrice,
          }),
          chairs: cleanQuantity({
            enabled: this.furnishing.chairs.enabled || this.furnishing.chairsLegacy.exists === true,
            priceItemCode: this.furnishing.chairs.priceItemCode ?? 'CHAIRS',
            quantity: this.furnishing.chairs.quantity ?? this.furnishing.chairsLegacy.count,
          }),
          stools: cleanQuantity({
            enabled: this.furnishing.stools.enabled || this.furnishing.stoolsLegacy.exists === true,
            priceItemCode: this.furnishing.stools.priceItemCode ?? 'STOOLS',
            quantity: this.furnishing.stools.quantity ?? this.furnishing.stoolsLegacy.count,
          }),
          dressingTable: cleanFixed({
            enabled: this.furnishing.dressingTable.enabled || this.furnishing.hasDressingTable === true,
            priceItemCode: this.furnishing.dressingTable.priceItemCode ?? 'DRESSING_TABLE',
          }),
          carpet: cleanArea({
            enabled: this.furnishing.carpet.enabled || this.furnishing.hasCarpet === true,
            priceItemCode: this.furnishing.carpet.priceItemCode ?? 'CARPET',
            area: this.furnishing.carpet.area ?? this.furnishing.carpetArea,
          }),
          bench: cleanFixed({
            enabled: this.furnishing.bench.enabled || this.furnishing.hasBench === true,
            priceItemCode: this.furnishing.bench.priceItemCode ?? 'BENCH',
          }),
          ac: cleanCustomQuantity({
            enabled: this.furnishing.ac.enabled || this.furnishing.acType !== '',
            priceItemCode:
              this.furnishing.ac.priceItemCode ??
              (this.furnishing.acType ? `AC_${this.furnishing.acType}`.toUpperCase() : null),
            pricingMode:
              this.furnishing.ac.pricingMode ?? (this.furnishing.acType ? 'Calculated' : null),
            quantity: this.furnishing.ac.quantity ?? this.furnishing.acQuantity,
            customPrice: this.furnishing.ac.customPrice,
          }),
        },
        additionalRequirements,
      }
    },

    async previewEstimate() {
      if (this.preview.loading) return

      this.preview.loading = true
      this.preview.error = null

      try {
        this.preview.data = await previewBedroomProject(this.buildPreviewPayload())
      } catch (error) {
        this.preview.error = error instanceof Error ? error.message : 'Unable to preview estimate.'
      } finally {
        this.preview.loading = false
      }
    },

    clearPreview() {
      this.preview.data = null
      this.preview.error = null
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
            sortOrder: 1,
          },
        ]
      }
    },

    resetPlanner() {
      this.$patch(createInitialState())
    },
  },
})
