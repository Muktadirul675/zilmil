<template>
  <div class="relative w-3 h-3">
    <!-- Pulsing circle -->
    <span 
      class="absolute inset-0 rounded-full opacity-75 animate-ping"
      :class="`bg-red-400`"
    ></span>
    <!-- Solid circle on top -->
    <span 
      class="absolute inset-0 rounded-full"
      :class="`bg-red-500`"
    ></span>
  </div>
</template>

<script setup>
defineProps({
  color: {
    type: String,
    default: 'green'
  }
})
</script>