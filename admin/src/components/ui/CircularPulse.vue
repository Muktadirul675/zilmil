<template>
  <div class="relative w-3 h-3">
    <!-- Pulsing circle -->
    <span class="absolute inset-0 rounded-full bg-green-400 opacity-75 animate-ping"></span>
    <!-- Solid circle on top -->
    <span class="absolute inset-0 rounded-full bg-green-500"></span>
  </div>
</template>

<script setup>
// No props needed, purely visual
</script>

<style scoped>
/* Tailwind's animate-ping handles the pulse */
</style>