<template>
  <div
    class="style-card"
    :class="{ 'is-selected': isSelected, 'is-compact': compact }"
    @click="emit('pick')"
  >
    <div class="card-image-wrapper">
      <img :src="image" :alt="name" class="style-image" />
      <div class="selection-badge">
        <i class="bi bi-check-lg"></i>
      </div>
    </div>
    <div class="card-content text-center">
      <h3 class="style-name">{{ name }}</h3>
      <p class="style-description">{{ description }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Define what data the card needs from the parent
withDefaults(
  defineProps<{
    name: string
    description: string
    image: string
    isSelected: boolean
    /** Smaller footprint for multi-question steps (e.g. Ceilings). */
    compact?: boolean
  }>(),
  { compact: false },
)

const emit = defineEmits<{ pick: [] }>()
</script>

<style scoped>
.style-card {
  cursor: pointer;
  background: transparent;
  border-radius: 20px;
  border: 1px solid rgba(44, 44, 44, 0.08);
  padding: 0;
  transition:
    border-color 0.25s ease,
    box-shadow 0.25s ease,
    transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  height: 100%;
  overflow: hidden;
}

.style-card:hover {
  border-color: rgba(44, 44, 44, 0.14);
  box-shadow: 0 12px 32px rgba(44, 44, 44, 0.08);
}

.card-image-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 20px 20px 0 0;
  aspect-ratio: 4/5;
  width: 100%;
}

.style-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  transition: transform 0.6s ease;
}

.style-card:hover .style-image {
  transform: scale(1.08);
}

.style-card.is-selected {
  border: 1px solid #9fd4f0;
  background: transparent;
  box-shadow:
    0 0 0 3px rgba(159, 212, 240, 0.4),
    0 12px 36px rgba(100, 170, 210, 0.16);
  transform: translateY(-4px);
}

.selection-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 32px;
  height: 32px;
  background: #7eb8dc;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.3s ease;
}

.style-card.is-selected .selection-badge {
  opacity: 1;
  transform: scale(1);
}

.card-content {
  padding: 1rem 1rem 1.25rem;
}

.style-name {
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1a1a1a;
}

.style-description {
  font-size: 1rem;
  color: #6c757d;
  line-height: 1.5;
}

/* Compact variant: shorter cards for forms with several questions on one screen */
.style-card.is-compact {
  border-radius: 14px;
}

.style-card.is-compact:hover {
  box-shadow: 0 8px 20px rgba(44, 44, 44, 0.07);
}

.style-card.is-compact.is-selected {
  box-shadow:
    0 0 0 2px rgba(159, 212, 240, 0.45),
    0 8px 22px rgba(100, 170, 210, 0.12);
  transform: translateY(-2px);
}

.style-card.is-compact .card-image-wrapper {
  border-radius: 14px 14px 0 0;
  aspect-ratio: 4 / 3;
  min-height: 180px;
  max-height: 220px;
}

.style-card.is-compact .selection-badge {
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  font-size: 0.75rem;
}

.style-card.is-compact .card-content {
  padding: 0.5rem 0.65rem 0.65rem;
}

.style-card.is-compact .style-name {
  font-size: 1rem;
  margin-bottom: 4px;
}

.style-card.is-compact .style-description {
  font-size: 0.9rem;
  line-height: 1.45;
}
</style>
