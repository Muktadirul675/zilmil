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

  // Date â DD-MM-YYYY
  currentDate.value = `${String(now.getDate()).padStart(2, '0')}/${String(
    now.getMonth() + 1
  ).padStart(2, '0')}/${now.getFullYear()}`

  // Time â HH:MM:SS AM/PM (12-hour)
  let hours = now.getHours()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12

  currentTime.value = `${String(hours).padStart(2, '0')}:${String(
    now.getMinutes()
  ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} ${ampm}`
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