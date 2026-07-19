export type PricingMode = 'Calculated' | 'Custom'

export type ReportCategory =
  | 'Design'
  | 'Ceiling'
  | 'Walls'
  | 'Flooring'
  | 'Furnishing'
  | 'Other'

export interface BedroomPlannerRequest {
  schemaVersion: 'bedroom-planner.v2'
  projectName: string
  clientName: string
  clientMobile: string | null
  currency: 'QAR'
  measurements: BedroomMeasurements
  design: BedroomDesign
  ceiling: BedroomCeiling
  walls: BedroomWalls
  flooring: BedroomFlooring
  furnishing: BedroomFurnishing
  additionalRequirements: AdditionalRequirement[]
}

export interface BedroomMeasurements {
  roomLength: number | null
  roomWidth: number | null
  ceilingArea: number | null
  wallArea: number | null
  flooringArea: number | null
}

export interface FixedItem {
  enabled: boolean
  priceItemCode: string | null
}

export interface QuantityItem extends FixedItem {
  quantity: number | null
}

export interface LengthItem extends FixedItem {
  length: number | null
}

export interface AreaItem extends FixedItem {
  area: number | null
}

export interface CustomFixedItem extends FixedItem {
  pricingMode: PricingMode | null
  customPrice: number | null
}

export interface CustomQuantityItem extends QuantityItem {
  pricingMode: PricingMode | null
  customPrice: number | null
}

export interface CustomAreaItem extends AreaItem {
  pricingMode: PricingMode | null
  customPrice: number | null
}

export interface CeilingLightItem {
  enabled: boolean
  priceItemCode: string | null
  quantity: number | null
}

export interface BedroomDesign {
  priceItemCode: string | null
}

export interface BedroomCeiling {
  gypsumCeiling: FixedItem
  cornish: LengthItem
  ceilingLights: CeilingLightItem[]
  chandelier: CustomQuantityItem
  curtainBox: LengthItem
  ceilingPainting: FixedItem & {
    paintColour: string | null
  }
}

export interface BedroomWalls {
  curtain: LengthItem
  moulding: LengthItem
  wallPainting: CustomFixedItem & {
    paintColour: string | null
  }
  wallpaper: FixedItem
  doors: QuantityItem
  windows: QuantityItem
  cladding: AreaItem
}

export interface BedroomFlooring {
  tiles: FixedItem & {
    material: string | null
    tileSize: string | null
  }
  skirting: LengthItem
  parquet: AreaItem
  glasswork: AreaItem
}

export interface BedroomFurnishing {
  bed: FixedItem
  headboardCladding: CustomAreaItem
  sideTable: QuantityItem
  sideLamps: QuantityItem
  tvUnit: CustomFixedItem
  chairs: QuantityItem
  stools: QuantityItem
  dressingTable: FixedItem
  carpet: AreaItem
  bench: FixedItem
  ac: CustomQuantityItem
}

export interface AdditionalRequirement {
  category: ReportCategory
  itemName: string
  description: string | null
  customPrice: number | null
}

export interface ProjectPriceLine {
  category: string
  itemCode: string | null
  itemName: string
  pricingMode: PricingMode
  selection: string | null
  quantity: number | null
  area: number | null
  length: number | null
  unit: string
  rateUsed: number | null
  customPrice: number | null
  calculationText: string
  finalAmount: number
  sortOrder: number
}

export interface CategorySubtotal {
  category: string
  amount: number
}

export interface BedroomPreviewResponse {
  schemaVersion: string
  currency: string
  priceLines: ProjectPriceLine[]
  categorySubtotals: CategorySubtotal[]
  grandTotal: number
  warnings: string[]
}

export interface SaveBedroomProjectRequest {
  projectName: string
  customerName: string
  customerPhone: string | null
  customerEmail: string | null
  customerAddress: string | null
  plannerRequest: BedroomPlannerRequest
}

export interface SavedBedroomProjectResponse {
  id: number | string
  projectName: string
  customerName: string
  customerPhone: string | null
  customerEmail: string | null
  customerAddress: string | null
  grandTotal?: number
  currency?: string
  createdAt?: string
  updatedAt?: string | null
}

export interface SavedBedroomProjectListItem {
  id: number | string
  projectName: string
  customerName: string
  customerPhone: string | null
  customerEmail: string | null
  customerAddress: string | null
  grandTotal: number
  currency: string
  createdAt: string
}

export interface SavedBedroomProjectDetailResponse {
  id: number | string
  projectName: string
  customerName: string
  customerPhone: string | null
  customerEmail: string | null
  customerAddress: string | null
  currency: string
  priceLines: ProjectPriceLine[]
  categorySubtotals: CategorySubtotal[]
  grandTotal: number
  warnings: string[]
  createdAt: string
  plannerRequest?: BedroomPlannerRequest
}

export interface PriceItemResponse {
  id: number
  code: string
  name: string
  category: string
  rate: number
  unit: string
  variableType: string
}

export interface AdditionalRequirementDraft extends AdditionalRequirement {
  id: string
}
