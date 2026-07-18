<template>
  <div class="price-management-page">
    <div class="container price-management-inner py-5">
      <header class="page-header mb-4">
        <div>
          <p class="text-muted small fw-bold text-uppercase mb-2">SuperAdmin</p>
          <h1 class="display-6 fw-bold mb-2">Price Management</h1>
          <p class="text-muted mb-0">Manage price rates and item availability for estimates.</p>
        </div>

        <div class="header-actions">
          <button type="button" class="btn btn-outline-secondary" @click="router.push('/dashboard')">
            <i class="bi bi-arrow-left me-2"></i>
            Dashboard
          </button>

          <button
            type="button"
            class="btn btn-outline-secondary icon-btn"
            :disabled="store.loading"
            title="Refresh"
            @click="refreshItems"
          >
            <span
              v-if="store.loading"
              class="spinner-border spinner-border-sm"
              aria-hidden="true"
            ></span>
            <i v-else class="bi bi-arrow-clockwise"></i>
          </button>
        </div>
      </header>

      <section class="toolbar mb-4">
        <div class="search-box">
          <i class="bi bi-search"></i>
          <input
            v-model.trim="searchTerm"
            type="search"
            class="form-control"
            placeholder="Search code, name, unit, category, variable type"
          />
        </div>

        <select v-model="statusFilter" class="form-select status-filter" aria-label="Status filter">
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </section>

      <div v-if="store.error" class="alert alert-danger">
        {{ store.error }}
      </div>

      <section class="table-shell">
        <div v-if="store.loading" class="loading-state">
          <span class="spinner-border text-primary" aria-hidden="true"></span>
          <p class="text-muted mb-0">Loading price items...</p>
        </div>

        <div v-else-if="filteredItems.length === 0" class="empty-state">
          <i class="bi bi-tags"></i>
          <h2 class="h5 fw-bold mb-1">No price items found</h2>
          <p class="text-muted mb-0">Try another search or status filter.</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table align-middle price-table mb-0">
            <thead>
              <tr>
                <th scope="col">Code</th>
                <th scope="col">Name</th>
                <th scope="col">Category</th>
                <th scope="col" class="text-end">Rate</th>
                <th scope="col">Unit</th>
                <th scope="col">Variable</th>
                <th scope="col">Status</th>
                <th scope="col">Updated</th>
                <th scope="col" class="text-end">Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in filteredItems" :key="item.id">
                <td>
                  <span class="code-chip">{{ item.code }}</span>
                </td>
                <td class="fw-semibold">{{ item.name }}</td>
                <td>{{ formatCategory(item.category) }}</td>
                <td class="text-end fw-semibold">{{ formatCurrency(item.rate) }}</td>
                <td>{{ item.unit }}</td>
                <td>{{ formatVariableType(item.variableType) }}</td>
                <td>
                  <span class="badge rounded-pill" :class="item.isActive ? 'text-bg-success' : 'text-bg-danger'">
                    {{ item.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>{{ formatDate(item.updatedAt) }}</td>
                <td>
                  <div class="row-actions">
                    <button
                      type="button"
                      class="btn btn-sm btn-outline-secondary"
                      title="Edit rate"
                      @click="openRateModal(item)"
                    >
                      <i class="bi bi-cash-coin"></i>
                    </button>

                    <button
                      type="button"
                      class="btn btn-sm btn-outline-secondary"
                      :title="item.isActive ? 'Deactivate' : 'Activate'"
                      :disabled="store.saving"
                      @click="openStatusModal(item)"
                    >
                      <i :class="item.isActive ? 'bi bi-toggle-on' : 'bi bi-toggle-off'"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <div v-if="rateTarget" class="modal-backdrop-layer">
      <div class="modal d-block" tabindex="-1" role="dialog" aria-modal="true">
        <div class="modal-dialog modal-dialog-centered">
          <form class="modal-content" @submit.prevent="saveRate">
            <div class="modal-header">
              <h2 class="modal-title h5 fw-bold">Update Rate</h2>
              <button type="button" class="btn-close" aria-label="Close" @click="closeRateModal"></button>
            </div>

            <div class="modal-body">
              <div v-if="formError" class="alert alert-danger">
                {{ formError }}
              </div>

              <dl class="item-summary mb-4">
                <div>
                  <dt>Code</dt>
                  <dd>{{ rateTarget.code }}</dd>
                </div>
                <div>
                  <dt>Name</dt>
                  <dd>{{ rateTarget.name }}</dd>
                </div>
                <div>
                  <dt>Unit</dt>
                  <dd>{{ rateTarget.unit }}</dd>
                </div>
              </dl>

              <label class="form-label fw-semibold">Rate</label>
              <div class="input-group">
                <span class="input-group-text">QAR</span>
                <input
                  v-model.number="rateForm.rate"
                  type="number"
                  min="0"
                  step="0.01"
                  class="form-control"
                  required
                />
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" @click="closeRateModal">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary action-btn" :disabled="store.saving">
                <span
                  v-if="store.saving"
                  class="spinner-border spinner-border-sm me-2"
                  aria-hidden="true"
                ></span>
                Save Rate
              </button>
            </div>
          </form>
        </div>
      </div>
      <div class="modal-backdrop show"></div>
    </div>

    <div v-if="statusTarget" class="modal-backdrop-layer">
      <div class="modal d-block" tabindex="-1" role="dialog" aria-modal="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h2 class="modal-title h5 fw-bold">
                {{ statusTarget.isActive ? 'Deactivate Price Item' : 'Activate Price Item' }}
              </h2>
              <button type="button" class="btn-close" aria-label="Close" @click="statusTarget = null"></button>
            </div>

            <div class="modal-body">
              <p class="mb-1">
                {{ statusTarget.isActive ? 'Deactivate' : 'Activate' }}
                <strong>{{ statusTarget.name }}</strong>?
              </p>
              <p class="text-muted mb-0">Code {{ statusTarget.code }} will remain in the catalogue.</p>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" @click="statusTarget = null">
                Cancel
              </button>
              <button type="button" class="btn btn-primary action-btn" :disabled="store.saving" @click="saveStatus">
                <span
                  v-if="store.saving"
                  class="spinner-border spinner-border-sm me-2"
                  aria-hidden="true"
                ></span>
                {{ statusTarget.isActive ? 'Deactivate' : 'Activate' }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-backdrop show"></div>
    </div>

    <div class="toast-container position-fixed top-0 end-0 p-3">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast show align-items-center text-bg-dark border-0 mb-2"
        role="status"
        aria-live="polite"
      >
        <div class="d-flex">
          <div class="toast-body">{{ toast.message }}</div>
          <button
            type="button"
            class="btn-close btn-close-white me-2 m-auto"
            aria-label="Close"
            @click="dismissToast(toast.id)"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePriceManagementStore } from '@/stores/priceManagement'
import type { PriceItemManagementResponse } from '@/types/priceManagement'

interface ToastMessage {
  id: number
  message: string
}

const router = useRouter()
const store = usePriceManagementStore()

const searchTerm = ref('')
const statusFilter = ref<'all' | 'active' | 'inactive'>('all')
const rateTarget = ref<PriceItemManagementResponse | null>(null)
const statusTarget = ref<PriceItemManagementResponse | null>(null)
const formError = ref('')
const toasts = ref<ToastMessage[]>([])

const rateForm = reactive({
  rate: 0,
})

const categoryLabels: Record<number, string> = {
  1: 'Design',
  2: 'Ceiling',
  3: 'Walls',
  4: 'Flooring',
  5: 'Furnishing',
  6: 'Other',
}

const variableTypeLabels: Record<number, string> = {
  1: 'Fixed',
  2: 'Quantity',
  3: 'Area',
  4: 'Length',
}

const filteredItems = computed(() => {
  const normalizedSearch = searchTerm.value.toLowerCase()

  return store.items
    .filter((item) => {
      if (statusFilter.value === 'active' && !item.isActive) return false
      if (statusFilter.value === 'inactive' && item.isActive) return false

      if (!normalizedSearch) return true

      return [
        item.code,
        item.name,
        item.unit,
        formatCategory(item.category),
        formatVariableType(item.variableType),
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch)
    })
    .sort((a, b) => a.category - b.category || a.code.localeCompare(b.code))
})

onMounted(() => {
  void refreshItems()
})

async function refreshItems() {
  await store.fetchItems()
}

function openRateModal(item: PriceItemManagementResponse) {
  rateTarget.value = item
  rateForm.rate = item.rate
  formError.value = ''
}

function closeRateModal() {
  if (store.saving) return
  rateTarget.value = null
  formError.value = ''
}

async function saveRate() {
  if (!rateTarget.value) return

  if (!Number.isFinite(rateForm.rate) || rateForm.rate < 0) {
    formError.value = 'Rate must be zero or greater.'
    return
  }

  try {
    await store.updateRate(rateTarget.value.id, Number(rateForm.rate))
    pushToast('Price item rate updated.')
    closeRateModal()
  } catch (error) {
    formError.value = error instanceof Error ? error.message : 'Unable to update price item rate.'
  }
}

function openStatusModal(item: PriceItemManagementResponse) {
  statusTarget.value = item
}

async function saveStatus() {
  if (!statusTarget.value) return

  try {
    const nextStatus = !statusTarget.value.isActive
    await store.updateStatus(statusTarget.value.id, nextStatus)
    pushToast(nextStatus ? 'Price item activated.' : 'Price item deactivated.')
    statusTarget.value = null
  } catch (error) {
    pushToast(error instanceof Error ? error.message : 'Unable to update item status.')
  }
}

function pushToast(message: string) {
  const id = Date.now()
  toasts.value = [...toasts.value, { id, message }]
  window.setTimeout(() => dismissToast(id), 3500)
}

function dismissToast(id: number) {
  toasts.value = toasts.value.filter((toast) => toast.id !== id)
}

function formatCategory(category: number) {
  return categoryLabels[category] ?? `Category ${category}`
}

function formatVariableType(variableType: number) {
  return variableTypeLabels[variableType] ?? `Type ${variableType}`
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-QA', {
    style: 'currency',
    currency: 'QAR',
    maximumFractionDigits: 2,
  }).format(value)
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'

  return new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(date)
}
</script>

<style scoped>
.price-management-page {
  min-height: 100vh;
  background: #f7f3ed;
  color: #2c2c2c;
}

.price-management-inner {
  max-width: 1180px;
}

.page-header,
.toolbar,
.table-shell {
  background: white;
  border: 1px solid rgba(20, 20, 20, 0.08);
  border-radius: 22px;
  box-shadow: 0 10px 30px rgba(30, 40, 50, 0.05);
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1.5rem;
}

.header-actions,
.toolbar,
.row-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.toolbar {
  padding: 1rem;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 220px;
}

.search-box i {
  position: absolute;
  top: 50%;
  left: 1rem;
  color: #8a8179;
  transform: translateY(-50%);
}

.search-box .form-control {
  min-height: 44px;
  padding-left: 2.75rem;
  border-radius: 14px;
}

.status-filter {
  width: 180px;
  min-height: 44px;
  border-radius: 14px;
}

.icon-btn {
  width: 44px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
}

.action-btn {
  background: #2f80c9;
  border-color: #2f80c9;
  font-weight: 700;
}

.action-btn:hover {
  background: #246daa;
  border-color: #246daa;
}

.table-shell {
  overflow: hidden;
}

.price-table th {
  padding: 1rem;
  color: #6c6258;
  font-size: 0.76rem;
  font-weight: 800;
  text-transform: uppercase;
  white-space: nowrap;
  background: #faf8f4;
}

.price-table td {
  padding: 1rem;
  border-color: rgba(20, 20, 20, 0.06);
  white-space: nowrap;
}

.code-chip {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0.25rem 0.65rem;
  border-radius: 8px;
  background: #f1f4f7;
  color: #28445d;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace;
  font-size: 0.82rem;
  font-weight: 800;
}

.row-actions {
  justify-content: flex-end;
}

.row-actions .btn {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}

.loading-state,
.empty-state {
  min-height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  text-align: center;
}

.empty-state i {
  color: #c8a97e;
  font-size: 2rem;
}

.modal-backdrop-layer {
  position: fixed;
  inset: 0;
  z-index: 1050;
}

.modal-backdrop-layer .modal {
  z-index: 1060;
}

.modal-content {
  border: 0;
  border-radius: 18px;
  box-shadow: 0 22px 70px rgba(0, 0, 0, 0.24);
}

.item-summary {
  display: grid;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid rgba(20, 20, 20, 0.08);
  border-radius: 14px;
  background: #faf8f4;
}

.item-summary div {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.item-summary dt {
  color: #6c6258;
  font-weight: 800;
}

.item-summary dd {
  margin: 0;
  text-align: right;
  font-weight: 650;
}

.form-control,
.form-select,
.input-group-text {
  border-radius: 12px;
}

.input-group .form-control {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.input-group .input-group-text {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.toast-container {
  z-index: 1100;
}

@media (max-width: 768px) {
  .page-header,
  .toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .header-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .status-filter {
    width: 100%;
  }
}
</style>
