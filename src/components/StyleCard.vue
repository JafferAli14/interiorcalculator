<script setup lang="ts">
import { computed } from 'vue'
import modernImg from '@/assets/modern.png'
import classicImg from '@/assets/classic.png'
import neoClassicImg from '@/assets/neo-classic.png'

const props = defineProps<{
  title: string
  imageSrc: string
}>()

const variantImages = {
  modern: modernImg,
  classic: classicImg,
  neoClassic: neoClassicImg,
} as const

const imageSrc = computed(() => variantImages[props.variant])
</script>

<template>
  <article class="style-card">
    <img :src="imageSrc" :alt="title" width="320" height="200" />
    <h3>{{ title }}</h3>
  </article>
</template>

<style scoped>
.style-card {
  border-radius: 8px;
  overflow: hidden;
}
</style>
