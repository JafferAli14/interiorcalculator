<template>
  <div class="step-container">
    <!-- Instruction -->
    <div class="step-intro text-center mb-4 mb-md-5">
      <h2 class="section-title mb-3">Select your design style</h2>
      <p class="text-muted intro-copy mx-auto">
        Choose a direction for your bedroom. We'll tailor the options in the next steps based on
        this look.
      </p>
    </div>

    <!-- 2 cards on top, 1 centered below -->
    <div class="style-cards-grid">
      <div v-for="style in designStyles" :key="style.id" class="style-card-cell">
        <div
          class="style-card"
          :class="{ 'is-selected': store.design.style === style.name }"
          @click="store.setDesignStyle(style.name)"
        >
          <div class="card-image-wrapper">
            <img :src="style.image" :alt="style.name" class="style-image" />
            <div class="selection-badge">
              <i class="bi bi-check-lg"></i>
            </div>
          </div>
          <div class="card-content text-center">
            <h3 class="style-name">{{ style.name }}</h3>
            <p class="style-description">{{ style.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlannerStore } from '@/stores/planner'
// Importing images from assets
import modernImg from '@/assets/modern.png'
import classicImg from '@/assets/classic.png'
import neoclassicImg from '@/assets/neo-classic.png'

const store = usePlannerStore()

const designStyles = [
  {
    id: 1,
    name: 'Modern',
    description: 'Minimalist lines, neutral tones, and sleek functionality.',
    image: modernImg,
  },
  {
    id: 2,
    name: 'Neo-Classic',
    description: 'A sophisticated blend of traditional luxury and contemporary clean edges.',
    image: neoclassicImg,
  },
  {
    id: 3,
    name: 'Classic',
    description: 'Timeless elegance with ornate detailing and rich textures.',
    image: classicImg,
  },
]
</script>

<style scoped>
.step-container {
  width: 100%;
  max-width: 960px;
  margin-inline: auto;
  padding-inline: clamp(0.75rem, 2vw, 1.25rem);
}

.step-intro {
  max-width: 36rem;
  margin-inline: auto;
}

.intro-copy {
  max-width: 32rem;
}

.section-title {
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #2c2c2c;
}

/* 2 + 1 card layout, centered on the page */
.style-cards-grid {
  --card-gap: clamp(1.5rem, 4vw, 2.5rem);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--card-gap);
  width: 100%;
  max-width: 880px;
  margin-inline: auto;
  align-items: stretch;
}

.style-card-cell:nth-child(3) {
  grid-column: 1 / -1;
  justify-self: center;
  width: 100%;
  max-width: calc(50% - var(--card-gap) / 2);
  min-width: 0;
}

@media (max-width: 767.98px) {
  .style-cards-grid {
    grid-template-columns: 1fr;
    max-width: 420px;
  }

  .style-card-cell:nth-child(3) {
    grid-column: auto;
    justify-self: stretch;
    max-width: none;
  }
}

/* Card Styling — no frosted panel; image + text read as one unit */
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
}

.style-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.style-card:hover .style-image {
  transform: scale(1.08);
}

/* Selection Effects — light blue outline */
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

.is-selected .selection-badge {
  opacity: 1;
  transform: scale(1);
}

/* Typography */
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
  font-size: 0.9rem;
  color: #6c757d;
  line-height: 1.4;
}
</style>
