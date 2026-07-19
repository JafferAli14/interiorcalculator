<template>
  <div class="step-container">
    <button type="button" class="dashboard-back" aria-label="Back to dashboard" @click="router.push('/dashboard')">
      <i class="bi bi-arrow-left"></i>
    </button>

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
        <StyleCard
          :name="style.name"
          :description="style.description"
          :image="style.image"
          :is-selected="store.design.style === style.name"
          @pick="store.setDesignStyle(style.name)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import StyleCard from '@/components/StyleCard.vue'
import { usePlannerStore } from '@/stores/Planner'
// Importing images from assets
import modernImg from '@/assets/modern.png'
import classicImg from '@/assets/classic.png'
import neoclassicImg from '@/assets/neo-classic.png'

const store = usePlannerStore()
const router = useRouter()

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
  position: relative;
  width: 100%;
  max-width: 960px;
  margin-inline: auto;
  padding-inline: clamp(0.75rem, 2vw, 1.25rem);
}

.dashboard-back {
  position: fixed;
  top: 22px;
  left: 28px;
  z-index: 1000;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border: 1px solid rgba(20, 20, 20, 0.1);
  border-radius: 50%;
  background: #ffffff;
  color: #2c2c2c;
  box-shadow: 0 10px 24px rgba(30, 40, 50, 0.08);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.dashboard-back:hover {
  background: #f8f5ef;
  box-shadow: 0 14px 30px rgba(30, 40, 50, 0.12);
  transform: translateX(-2px);
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
  .dashboard-back {
    top: 16px;
    left: 16px;
    width: 40px;
    height: 40px;
    border-radius: 8px;
  }

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

@media (max-width: 575.98px) {
  .step-container {
    padding-inline: 0;
  }

  .step-intro {
    margin-bottom: 1.5rem !important;
  }

  .section-title {
    font-size: 1.65rem;
    line-height: 1.2;
  }

  .intro-copy {
    font-size: 0.95rem;
  }
}
</style>
