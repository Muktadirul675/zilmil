<template>
  <div class="flex flex-col items-center justify-center min-h-[200px] space-y-4 text-gray-600">
    <div class="loader w-12 h-12 border-4 border-dashed rounded-full animate-spin border-red-500"></div>
    <div class="text-center text-sm italic">{{ randomMessage }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const messages = [
  'Loading magic...',
  'Warming up the server...',
  'Fetching something awesome...',
  'Almost there...',
  'Hold tight, good things take time!',
  'Generating awesomeness...',
];

const randomMessage = ref('');

onMounted(() => {
  const index = Math.floor(Math.random() * messages.length);
  randomMessage.value = messages[index];
});
</script>

<style scoped>
.loader {
  border-top-color: transparent;
}
</style>