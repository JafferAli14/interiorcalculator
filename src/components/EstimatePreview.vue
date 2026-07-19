<template>
  <section class="estimate-preview">
    <div class="estimate-header">
      <div>
        <p class="text-muted small fw-bold text-uppercase mb-1">Authoritative Estimate</p>
        <h2 class="h4 fw-bold mb-0">Backend Price Preview</h2>
      </div>

      <span class="currency-pill">{{ preview.currency }}</span>
    </div>

    <div v-if="preview.warnings.length > 0" class="alert alert-warning estimate-warnings">
      <div v-for="warning in preview.warnings" :key="warning">{{ warning }}</div>
    </div>

    <div class="category-stack">
      <section v-for="group in categoryGroups" :key="group.category" class="category-card">
        <div class="category-heading">
          <h3 class="h5 fw-bold mb-0">{{ group.category }}</h3>
          <strong>{{ formatCurrency(group.subtotal?.amount ?? 0) }}</strong>
        </div>

        <div class="price-table">
          <div class="price-row price-row-head" :class="{ 'without-calculation': !showCalculation }">
            <span>Item</span>
            <span>Details</span>
            <span v-if="showCalculation">Calculation</span>
            <span class="amount-cell">Amount</span>
          </div>

          <div
            v-for="line in group.lines"
            :key="lineKey(line)"
            class="price-row"
            :class="{ 'without-calculation': !showCalculation }"
          >
            <div>
              <strong>{{ line.itemName }}</strong>
            </div>

            <div class="details-cell">
              <span
                class="badge"
                :class="line.pricingMode === 'Custom' ? 'text-bg-dark' : 'text-bg-light'"
              >
                {{ line.pricingMode === 'Custom' ? 'Custom' : 'Calculated' }}
              </span>
              <span v-if="line.selection" class="selection-text">{{ line.selection }}</span>
            </div>

            <div v-if="showCalculation" class="calculation-cell">
              {{ line.calculationText }}
            </div>

            <strong class="amount-cell">{{ formatCurrency(line.finalAmount) }}</strong>
          </div>
        </div>
      </section>
    </div>

    <section class="grand-total-card">
      <span>Grand Total</span>
      <strong>{{ formatCurrency(preview.grandTotal) }}</strong>
    </section>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type {
  BedroomPreviewResponse,
  ProjectPriceLine,
} from '@/types/bedroomPlanner'

const props = withDefaults(defineProps<{
  preview: BedroomPreviewResponse
  showCalculation?: boolean
}>(), {
  showCalculation: true,
})

const fixedCategoryOrder = ['Design', 'Ceiling', 'Walls', 'Flooring', 'Furnishing', 'Other']

const categoryGroups = computed(() => {
  const categoriesFromSubtotals = props.preview.categorySubtotals.map((item) => item.category)
  const categoriesFromLines = props.preview.priceLines.map((item) => item.category)
  const categories = [...new Set([...categoriesFromSubtotals, ...categoriesFromLines])]

  return categories
    .sort((a, b) => categorySortIndex(a) - categorySortIndex(b))
    .map((category) => ({
      category,
      subtotal: props.preview.categorySubtotals.find((item) => item.category === category),
      lines: props.preview.priceLines.filter((line) => line.category === category),
    }))
    .filter((group) => group.lines.length > 0 || group.subtotal)
})

function categorySortIndex(category: string): number {
  const subtotalIndex = props.preview.categorySubtotals.findIndex((item) => item.category === category)
  if (subtotalIndex >= 0) return subtotalIndex

  const fixedIndex = fixedCategoryOrder.indexOf(category)
  return fixedIndex >= 0 ? fixedIndex + props.preview.categorySubtotals.length : Number.MAX_SAFE_INTEGER
}

function formatCurrency(amount: number): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: props.preview.currency || 'QAR',
      currencyDisplay: 'code',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `QAR ${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }
}

function lineKey(line: ProjectPriceLine): string {
  return `${line.category}-${line.itemCode ?? line.itemName}-${line.sortOrder}`
}
</script>

<style scoped>
.estimate-preview {
  width: 100%;
  max-width: 980px;
  margin-top: 2rem;
}

.estimate-header,
.grand-total-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background: white;
  border: 1px solid rgba(20, 20, 20, 0.08);
  border-radius: 18px;
  padding: 1.25rem 1.5rem;
  box-shadow: 0 10px 30px rgba(30, 40, 50, 0.05);
}

.currency-pill {
  border-radius: 999px;
  background: rgba(201, 174, 135, 0.16);
  color: #7f653e;
  padding: 0.4rem 0.8rem;
  font-weight: 800;
}

.estimate-warnings {
  margin: 1rem 0 0;
}

.category-stack {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
}

.category-card {
  background: white;
  border: 1px solid rgba(20, 20, 20, 0.08);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(30, 40, 50, 0.04);
}

.category-heading {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: rgba(248, 249, 250, 0.9);
  border-bottom: 1px solid rgba(20, 20, 20, 0.08);
}

.price-table {
  width: 100%;
}

.price-row {
  display: grid;
  grid-template-columns: minmax(150px, 1.1fr) minmax(130px, 0.9fr) minmax(180px, 1.4fr) minmax(110px, 0.7fr);
  gap: 1rem;
  align-items: start;
  padding: 0.95rem 1.25rem;
  border-bottom: 1px solid rgba(20, 20, 20, 0.06);
}

.price-row.without-calculation {
  grid-template-columns: minmax(180px, 1.2fr) minmax(150px, 1fr) minmax(110px, 0.7fr);
}

.price-row:last-child {
  border-bottom: 0;
}

.price-row-head {
  color: #6c757d;
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.details-cell {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  align-items: center;
}

.selection-text,
.calculation-cell {
  color: #5b626a;
}

.amount-cell {
  text-align: right;
}

.grand-total-card {
  margin-top: 1rem;
  background: #2c2c2c;
  color: white;
  font-size: 1.15rem;
}

.grand-total-card strong {
  font-size: 1.5rem;
}

@media (max-width: 768px) {
  .estimate-header,
  .grand-total-card,
  .category-heading {
    flex-direction: column;
    align-items: flex-start;
  }

  .price-row,
  .price-row-head {
    grid-template-columns: 1fr;
  }

  .price-row-head {
    display: none;
  }

  .amount-cell {
    text-align: left;
  }
}
</style>
