import { defineStore } from 'pinia'
import {
  getManagedPriceItems,
  updateManagedPriceItemRate,
  updateManagedPriceItemStatus,
} from '@/services/superAdminPriceItemApi'
import type { PriceItemManagementResponse } from '@/types/priceManagement'

interface PriceManagementState {
  items: PriceItemManagementResponse[]
  loading: boolean
  saving: boolean
  error: string | null
}

export const usePriceManagementStore = defineStore('priceManagement', {
  state: (): PriceManagementState => ({
    items: [],
    loading: false,
    saving: false,
    error: null,
  }),

  actions: {
    async fetchItems() {
      if (this.loading) return

      this.loading = true
      this.error = null

      try {
        this.items = await getManagedPriceItems()
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unable to load price items.'
      } finally {
        this.loading = false
      }
    },

    async updateRate(id: number, rate: number) {
      this.saving = true
      this.error = null

      try {
        const updated = await updateManagedPriceItemRate(id, { rate })
        const fallbackUpdated = (item: PriceItemManagementResponse) =>
          item.id === id ? { ...item, rate, updatedAt: new Date().toISOString() } : item

        this.items = updated
          ? this.items.map((item) => (item.id === id ? updated : item))
          : this.items.map(fallbackUpdated)

        return updated
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unable to update price item rate.'
        throw error
      } finally {
        this.saving = false
      }
    },

    async updateStatus(id: number, isActive: boolean) {
      this.saving = true
      this.error = null

      try {
        const updated = await updateManagedPriceItemStatus(id, { isActive })
        const fallbackUpdated = (item: PriceItemManagementResponse) =>
          item.id === id ? { ...item, isActive, updatedAt: new Date().toISOString() } : item

        this.items = updated
          ? this.items.map((item) => (item.id === id ? updated : item))
          : this.items.map(fallbackUpdated)

        return updated
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unable to update price item status.'
        throw error
      } finally {
        this.saving = false
      }
    },
  },
})
