<template>
  <div
    class="customer-modal-backdrop"
    @click.self="requestClose"
  >
    <section
      class="customer-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="customer-details-title"
    >
      <header class="modal-header-block">
        <h2 id="customer-details-title" class="h4 fw-bold mb-1">Customer Details</h2>
        <p class="text-muted mb-0">Add the project details before generating the estimate.</p>
      </header>

      <form class="modal-form" novalidate @submit.prevent="submit">
        <div v-if="error" class="alert alert-danger mb-0">
          {{ error }}
        </div>

        <div>
          <label for="project-name" class="form-label small fw-bold text-muted mb-2">
            Project Name
          </label>
          <input
            id="project-name"
            v-model="form.projectName"
            type="text"
            class="form-control form-control-lg rounded-3 shadow-sm"
            :class="{ 'is-invalid': touched.projectName && projectNameError }"
            autocomplete="off"
            @blur="touched.projectName = true"
          />
          <p v-if="touched.projectName && projectNameError" class="validation-message">
            {{ projectNameError }}
          </p>
        </div>

        <div>
          <label for="customer-name" class="form-label small fw-bold text-muted mb-2">
            Customer Name
          </label>
          <input
            id="customer-name"
            v-model="form.clientName"
            type="text"
            class="form-control form-control-lg rounded-3 shadow-sm"
            :class="{ 'is-invalid': touched.clientName && clientNameError }"
            autocomplete="name"
            @blur="touched.clientName = true"
          />
          <p v-if="touched.clientName && clientNameError" class="validation-message">
            {{ clientNameError }}
          </p>
        </div>

        <div>
          <label for="customer-phone" class="form-label small fw-bold text-muted mb-2">
            Phone
          </label>
          <input
            id="customer-phone"
            v-model="form.clientMobile"
            type="tel"
            class="form-control form-control-lg rounded-3 shadow-sm"
            autocomplete="tel"
          />
        </div>

        <div>
          <label for="customer-email" class="form-label small fw-bold text-muted mb-2">
            Email
          </label>
          <input
            id="customer-email"
            v-model="form.clientEmail"
            type="email"
            class="form-control form-control-lg rounded-3 shadow-sm"
            :class="{ 'is-invalid': touched.clientEmail && emailError }"
            autocomplete="email"
            @blur="touched.clientEmail = true"
          />
          <p v-if="touched.clientEmail && emailError" class="validation-message">
            {{ emailError }}
          </p>
        </div>

        <div>
          <label for="customer-address" class="form-label small fw-bold text-muted mb-2">
            Address
          </label>
          <textarea
            id="customer-address"
            v-model="form.clientAddress"
            rows="3"
            class="form-control rounded-3 shadow-sm"
            autocomplete="street-address"
          />
        </div>

        <footer class="modal-actions">
          <button type="button" class="btn btn-outline-secondary" :disabled="loading" @click="requestClose">
            Cancel
          </button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <span
              v-if="loading"
              class="spinner-border spinner-border-sm me-2"
              aria-hidden="true"
            ></span>
            Generate Estimate
          </button>
        </footer>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive } from 'vue'
import { usePlannerStore } from '@/stores/Planner'

const props = defineProps<{
  loading: boolean
  error: string | null
}>()

const emit = defineEmits<{
  cancel: []
  submit: [
    values: {
      projectName: string
      clientName: string
      clientMobile: string
      clientEmail: string
      clientAddress: string
    },
  ]
}>()

const store = usePlannerStore()

const form = reactive({
  projectName: store.projectName,
  clientName: store.clientName,
  clientMobile: store.clientMobile,
  clientEmail: store.clientEmail,
  clientAddress: store.clientAddress,
})

const touched = reactive({
  projectName: false,
  clientName: false,
  clientEmail: false,
})

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const projectNameError = computed(() =>
  form.projectName.trim() ? '' : 'Project Name is required.',
)
const clientNameError = computed(() =>
  form.clientName.trim() ? '' : 'Customer Name is required.',
)
const emailError = computed(() => {
  const email = form.clientEmail.trim()
  if (!email) return ''
  return emailPattern.test(email) ? '' : 'Enter a valid email address.'
})
const isValid = computed(
  () => !projectNameError.value && !clientNameError.value && !emailError.value,
)

function touchRequiredFields() {
  touched.projectName = true
  touched.clientName = true
  touched.clientEmail = true
}

function requestClose() {
  if (props.loading) return
  emit('cancel')
}

function submit() {
  if (props.loading) return

  touchRequiredFields()
  if (!isValid.value) return

  emit('submit', {
    projectName: form.projectName.trim(),
    clientName: form.clientName.trim(),
    clientMobile: form.clientMobile.trim(),
    clientEmail: form.clientEmail.trim(),
    clientAddress: form.clientAddress.trim(),
  })
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    requestClose()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.customer-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
  background: rgba(15, 15, 15, 0.58);
}

.customer-modal {
  width: min(100%, 620px);
  max-height: calc(100vh - 2.5rem);
  overflow: auto;
  border: 1px solid rgba(20, 20, 20, 0.08);
  border-radius: 22px;
  background: #ffffff;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.24);
}

.modal-header-block {
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid rgba(20, 20, 20, 0.08);
}

.modal-form {
  display: grid;
  gap: 1rem;
  padding: 1.5rem;
}

.validation-message {
  margin: 0.35rem 0 0;
  color: #dc3545;
  font-size: 0.875rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 0.5rem;
}

@media (max-width: 575.98px) {
  .customer-modal-backdrop {
    align-items: flex-start;
    padding: 0.75rem;
  }

  .customer-modal {
    width: 100%;
    max-height: calc(100vh - 1.5rem);
  }

  .modal-header-block,
  .modal-form {
    padding-inline: 1rem;
  }

  .modal-actions {
    flex-direction: column-reverse;
  }

  .modal-actions .btn {
    width: 100%;
  }
}
</style>
