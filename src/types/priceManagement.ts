export interface PriceItemManagementResponse {
  id: number
  code: string
  name: string
  category: number
  rate: number
  unit: string
  variableType: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface PriceItemRateUpdateRequest {
  rate: number
}

export interface PriceItemStatusUpdateRequest {
  isActive: boolean
}
