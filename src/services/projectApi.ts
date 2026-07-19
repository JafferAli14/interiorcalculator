import axios from 'axios'
import api from './api'
import type {
  BedroomPlannerRequest,
  BedroomPreviewResponse,
  SaveBedroomProjectRequest,
  SavedBedroomProjectDetailResponse,
  SavedBedroomProjectListItem,
  SavedBedroomProjectResponse,
} from '@/types/bedroomPlanner'

function getErrorMessage(error: unknown, fallbackMessage: string): string {
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
  return fallbackMessage
}

export async function previewBedroomProject(
  payload: BedroomPlannerRequest,
): Promise<BedroomPreviewResponse> {
  try {
    const response = await api.post<BedroomPreviewResponse>('/Projects/preview', payload)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to preview bedroom project.'))
  }
}

export async function saveBedroomProject(
  payload: SaveBedroomProjectRequest,
): Promise<SavedBedroomProjectResponse> {
  try {
    const response = await api.post<SavedBedroomProjectResponse>('/Projects', payload)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to save bedroom project.'))
  }
}

export async function getSavedProjects(): Promise<SavedBedroomProjectListItem[]> {
  try {
    const response = await api.get<SavedBedroomProjectListItem[]>('/Projects')
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to load saved projects.'))
  }
}

export async function getSavedProjectById(
  projectId: string | number,
): Promise<SavedBedroomProjectDetailResponse> {
  try {
    const response = await api.get<SavedBedroomProjectDetailResponse>(
      `/Projects/${encodeURIComponent(String(projectId))}`,
    )
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to load saved project report.'))
  }
}
