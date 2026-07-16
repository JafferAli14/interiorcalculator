<template>
  <div class="additional-step">
    <header class="step-header text-center mb-4">
      <h2 class="page-title mb-2 text-dark fw-bold">Additional Requirements</h2>

      <p class="text-muted fs-6 mb-0">
        Add any custom requirements not covered in previous sections. You can skip this step if not
        needed.
      </p>
    </header>

    <div class="inputs-stack">
      <section class="input-block mb-4">
        <div class="d-flex flex-column flex-sm-row justify-content-between gap-3 align-items-sm-center">
          <div>
            <h3 class="input-block-title h6 fw-bold mb-1">Additional Requirements</h3>
            <p class="text-muted small mb-0">Create one row for each manual-price requirement.</p>
          </div>

          <button type="button" class="btn btn-add" @click="store.addAdditionalRequirement">
            + Add Requirement
          </button>
        </div>
      </section>

      <section
        v-for="(requirement, index) in store.additionalRequirements"
        :key="requirement.id"
        class="requirement-card mb-4"
      >
        <div class="d-flex justify-content-between gap-3 align-items-start mb-3">
          <h3 class="input-block-title h6 fw-bold mb-0">Requirement {{ index + 1 }}</h3>

          <button
            type="button"
            class="btn btn-outline-danger btn-sm"
            @click="store.removeAdditionalRequirement(index)"
          >
            Remove
          </button>
        </div>

        <div class="row g-3">
          <div class="col-12 col-md-6">
            <label class="form-label small fw-bold text-muted mb-2">Category</label>
            <div class="category-select">
              <button
                type="button"
                class="category-trigger"
                :class="{ open: openCategoryIndex === index }"
                @click="toggleCategoryMenu(index)"
              >
                <span class="category-label">{{ requirement.category }}</span>
                <span class="category-chevron"></span>
              </button>

              <div v-if="openCategoryIndex === index" class="category-menu">
                <button
                  v-for="category in categories"
                  :key="category"
                  type="button"
                  class="category-option"
                  :class="{ selected: requirement.category === category }"
                  @click="selectCategory(index, category)"
                >
                  <span class="category-dot" :class="categoryClass(category)"></span>
                  <span>{{ category }}</span>
                </button>
              </div>
            </div>
          </div>

          <div class="col-12 col-md-6">
            <label class="form-label small fw-bold text-muted mb-2">Item Name</label>
            <input
              :value="requirement.itemName"
              type="text"
              class="form-control form-control-lg rounded-3 shadow-sm"
              placeholder="Ex: Extra LED Strip"
              @input="
                store.updateAdditionalRequirement(index, {
                  itemName: ($event.target as HTMLInputElement).value,
                })
              "
            />
          </div>

          <div class="col-12">
            <label class="form-label small fw-bold text-muted mb-2">Description</label>
            <textarea
              :value="requirement.description ?? ''"
              rows="3"
              class="form-control rounded-3 shadow-sm"
              placeholder="Ex: TV Area"
              @input="
                store.updateAdditionalRequirement(index, {
                  description: ($event.target as HTMLTextAreaElement).value,
                })
              "
            />
          </div>

          <div class="col-12 col-md-6">
            <label class="form-label small fw-bold text-muted mb-2">Manual Price (QAR)</label>
            <input
              :value="requirement.customPrice ?? ''"
              type="number"
              min="1"
              class="form-control form-control-lg rounded-3 shadow-sm"
              placeholder="Ex: 1200"
              @input="
                store.updateAdditionalRequirement(index, {
                  customPrice: parsePositiveNumber(($event.target as HTMLInputElement).value),
                })
              "
            />
          </div>
        </div>
      </section>

      <section v-if="store.additionalRequirements.length === 0" class="empty-state text-center">
        <p class="text-muted mb-0">No additional requirements added.</p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePlannerStore } from '@/stores/Planner'
import type { ReportCategory } from '@/types/bedroomPlanner'

const store = usePlannerStore()
const openCategoryIndex = ref<number | null>(null)

const categories: ReportCategory[] = [
  'Design',
  'Ceiling',
  'Walls',
  'Flooring',
  'Furnishing',
  'Other',
]

function parsePositiveNumber(value: string): number | null {
  if (value === '') return null

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function toggleCategoryMenu(index: number) {
  openCategoryIndex.value = openCategoryIndex.value === index ? null : index
}

function selectCategory(index: number, category: ReportCategory) {
  store.updateAdditionalRequirement(index, { category })
  openCategoryIndex.value = null
}

function categoryClass(category: ReportCategory) {
  return `category-${category.toLowerCase()}`
}
</script>

<style scoped>
.additional-step {
  width: 100%;
  max-width: 760px;
  margin-inline: auto;
}

.input-block,
.requirement-card,
.empty-state {
  background: white;
  border: 1px solid rgba(20, 20, 20, 0.08);
  border-radius: 22px;
  padding: 1.5rem;
  box-shadow: 0 10px 30px rgba(30, 40, 50, 0.04);
}

.input-block-title {
  font-size: 1.1rem;
}

.btn-add {
  background: #c8a97e;
  color: white;
  border: none;
  border-radius: 14px;
  padding: 0.75rem 1.25rem;
  font-weight: 700;
  box-shadow: 0 10px 20px rgba(200, 169, 126, 0.2);
}

.btn-add:hover {
  background: #a88b5a;
  color: white;
}

.category-select {
  position: relative;
}

.category-trigger {
  width: 100%;
  min-height: 58px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border: 1px solid #dee2e6;
  border-radius: 14px;
  background: white;
  color: #1a1a1a;
  padding: 0.5rem 1rem;
  text-align: left;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.category-trigger.open {
  border-color: rgba(201, 174, 135, 0.85);
  box-shadow:
    0 0 0 3px rgba(201, 174, 135, 0.16),
    0 14px 30px rgba(30, 40, 50, 0.1);
}

.category-trigger:hover:not(.open) {
  border-color: #ced4da;
}

.category-label {
  flex: 1;
  font-size: 1.25rem;
  font-weight: 400;
  line-height: 1.5;
}

.category-chevron {
  width: 0.65rem;
  height: 0.65rem;
  border-right: 2px solid #6c6258;
  border-bottom: 2px solid #6c6258;
  transform: rotate(45deg) translateY(-2px);
  transition: transform 0.2s ease;
}

.category-trigger.open .category-chevron {
  transform: rotate(225deg) translate(-2px, -2px);
}

.category-menu {
  position: absolute;
  z-index: 20;
  left: 0;
  right: 0;
  top: calc(100% + 0.45rem);
  overflow: hidden;
  border: 1px solid rgba(201, 174, 135, 0.45);
  border-radius: 16px;
  background: white;
  box-shadow: 0 18px 42px rgba(30, 40, 50, 0.18);
  padding: 0.4rem;
}

.category-option {
  width: 100%;
  min-height: 46px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: #2c2c2c;
  padding: 0.65rem 0.8rem;
  text-align: left;
  font-weight: 650;
  transition:
    background 0.18s ease,
    color 0.18s ease;
}

.category-option:hover {
  background: rgba(201, 174, 135, 0.13);
}

.category-option.selected {
  background: rgba(201, 174, 135, 0.22);
  color: #6f5838;
}

.category-dot {
  width: 0.72rem;
  height: 0.72rem;
  flex: 0 0 auto;
  border-radius: 50%;
  background: #c9ae87;
  box-shadow: 0 0 0 4px rgba(201, 174, 135, 0.18);
}

.category-design {
  background: #7c5cff;
  box-shadow: 0 0 0 4px rgba(124, 92, 255, 0.16);
}

.category-ceiling {
  background: #2f80ed;
  box-shadow: 0 0 0 4px rgba(47, 128, 237, 0.14);
}

.category-walls {
  background: #d95f76;
  box-shadow: 0 0 0 4px rgba(217, 95, 118, 0.14);
}

.category-flooring {
  background: #b7791f;
  box-shadow: 0 0 0 4px rgba(183, 121, 31, 0.15);
}

.category-furnishing {
  background: #2f9e8f;
  box-shadow: 0 0 0 4px rgba(47, 158, 143, 0.15);
}

.category-other {
  background: #6c757d;
  box-shadow: 0 0 0 4px rgba(108, 117, 125, 0.14);
}

@media (max-width: 768px) {
  .input-block,
  .requirement-card,
  .empty-state {
    padding: 1.2rem;
  }
}
</style>
