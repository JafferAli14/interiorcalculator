import api from './api'
import type { BedroomPlannerRequest, BedroomPreviewResponse } from '@/types/bedroomPlanner'

function getErrorMessage(error: unknown): string {
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
