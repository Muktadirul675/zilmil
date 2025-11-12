<template>
  <div>
    <svg ref="barcode"></svg>
  </div>
</template>

<script setup>
import { onMounted, watch, ref } from 'vue'
import JsBarcode from 'jsbarcode'

const props = defineProps({
  value: {
    type: String,
    required: true
  },
  format: {
    type: String,
    default: 'CODE128' // Supports CODE128, EAN13, UPC, etc.
  },
  width: {
    type: Number,
    default: 2
  },
  height: {
    type: Number,
    default: 50
  },
  displayValue: {
    type: Boolean,
    default: true
  }
})

const barcode = ref(null)

const generateBarcode = () => {
  if (barcode.value) {
    JsBarcode(barcode.value, props.value, {
      format: props.format,
      width: props.width,
      height: props.height,
      displayValue: props.displayValue
    })
  }
}

onMounted(generateBarcode)
watch(() => props.value, generateBarcode)
</script>