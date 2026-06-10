<template>
  <div class="projects-page">
    <button @click="router.push('/dashboard')">
      ← Back
    </button>

    <h1>Saved Projects</h1>

    <p>Project list will appear here.</p>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>