<template>
  <div class="flex flex-col items-center justify-center text-center p-2 space-y-2">
    <div class="flex items-center space-x-2 text- font-semibold text--700 dark:text--300">
      <i class="pi pi-calendar"></i>
      <span>{{ currentDate }}</span>
    </div>

    <div class="flex items-center space-x-2 text- font-bold text--900 dark:text--100 tracking-wide">
      <i class="pi pi-clock"></i>
      <span>{{ currentTime }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const currentDate = ref('')
const currentTime = ref('')
let timer = null

function updateClock() {
  const now = new Date()

  // Format date â YYYY/MM/DD
  currentDate.value = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(
    now.getDate()
  ).padStart(2, '0')}`

  // Format time â HH:MM:SS
  currentTime.value = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(
    2,
    '0'
  )}:${String(now.getSeconds()).padStart(2, '0')}`
}

onMounted(() => {
  updateClock()
  timer = setInterval(updateClock, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style scoped>
/* Optional styling for PrimeIcons */
.pi {
  font-size: 1.2em;
}
</style>