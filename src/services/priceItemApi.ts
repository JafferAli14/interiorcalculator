import api from './api'
import type { PriceItemResponse } from '@/types/bedroomPlanner'

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return 'Unable to load price items.'
}

export async function getPriceItems(): Promise<PriceItemResponse[]> {
  try {
    const response = await api.get<PriceItemResponse[]>('/price-items')
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function getPriceItemByCode(code: string): Promise<PriceItemResponse> {
  try {
    const response = await api.get<PriceItemResponse>(`/price-items/${encodeURIComponent(code)}`)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
