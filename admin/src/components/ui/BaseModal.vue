<template>
  <transition name="fade">
    <div v-if="modelValue" class="modal-backdrop" @click.self="close">
      <div class="modal-content">
        <!-- Close button -->
        <button class="modal-close" @click="close">&times;</button>

        <!-- Slot for custom content -->
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})

const emits = defineEmits(['update:modelValue', 'close'])

function close() {
  emits('update:modelValue', false)
  emits('close')
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  background: white;
  border-radius: 8px;
  padding: 20px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.modal-close {
  position: absolute;
  top: 8px;
  right: 12px;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>