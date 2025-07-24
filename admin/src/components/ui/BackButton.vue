<template>
  <button
    @click="handleBack"
    class="flex items-center cursor-pointer text-gray-700 hover:text-black transition-colors"
    aria-label="Back"
  >
    <i class="pi pi-arrow-left text-lg"></i>
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>