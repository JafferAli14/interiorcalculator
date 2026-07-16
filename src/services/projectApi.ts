import axios from 'axios'
import api from './api'
import type { BedroomPlannerRequest, BedroomPreviewResponse } from '@/types/bedroomPlanner'

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

    if (error.message) return error.message
  }

  if (error instanceof Error) return error.message
  return 'Unable to preview bedroom project.'
}

export async function previewBedroomProject(
  payload: BedroomPlannerRequest,
): Promise<BedroomPreviewResponse> {
  try {
    const response = await api.post<BedroomPreviewResponse>('/Projects/preview', payload)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
