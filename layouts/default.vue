<script setup>
import { SpeedInsights } from '@vercel/speed-insights/vue'
</script>

<template>
  <SpeedInsights />
  <div>
    <NavBar />
    <slot />
    <Footer />
  </div>
</template>
