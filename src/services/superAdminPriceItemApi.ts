import axios from 'axios'
import api from './api'
import type {
  PriceItemManagementResponse,
  PriceItemRateUpdateRequest,
  PriceItemStatusUpdateRequest,
} from '@/types/priceManagement'

const basePath = '/superadmin/price-items'

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data

    if (data && typeof data === 'object') {
      const responseData = data as {
        errors?: unknown
        message?: unknown
        title?: unknown
        detail?: unknown
      }

      if (Array.isArray(responseData.errors)) {
        const messages = responseData.errors.filter((item): item is string => typeof item === 'string')
        if (messages.length > 0) return messages.join(' ')
      }

      if (typeof responseData.errors === 'object' && responseData.errors !== null) {
        const messages = Object.values(responseData.errors)
          .flat()
          .filter((item): item is string => typeof item === 'string')
        if (messages.length > 0) return messages.join(' ')
      }

      if (typeof responseData.message === 'string') return responseData.message
      if (typeof responseData.detail === 'string') return responseData.detail
      if (typeof responseData.title === 'string') return responseData.title
    }

    if (error.response?.status === 401) return 'Your session has expired. Please log in again.'
    if (error.response?.status === 403) return 'Only SuperAdmin users can manage price items.'
    if (error.message) return error.message
  }

  if (error instanceof Error) return error.message
  return 'Unable to manage price items.'
}

export async function getManagedPriceItems(): Promise<PriceItemManagementResponse[]> {
  try {
    const response = await api.get<PriceItemManagementResponse[]>(basePath)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function updateManagedPriceItemRate(
  id: number,
  payload: PriceItemRateUpdateRequest,
): Promise<PriceItemManagementResponse | null> {
  try {
    const response = await api.patch<PriceItemManagementResponse>(`${basePath}/${id}/rate`, payload)
    return response.data ?? null
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function updateManagedPriceItemStatus(
  id: number,
  payload: PriceItemStatusUpdateRequest,
): Promise<PriceItemManagementResponse | null> {
  try {
    const response = await api.patch<PriceItemManagementResponse>(`${basePath}/${id}/status`, payload)
    return response.data ?? null
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
