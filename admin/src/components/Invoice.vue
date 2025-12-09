<template>
  <button class="btn" @click.stop="dwnld">Download</button>
  <div ref="invoice" class="invoice-container relative"
    style="height:auto;width:875px; height: 1240px; background:#ffffff; box-sizing:border-box; font-family:Arial, sans-serif; font-size:14px; overflow:hidden;margin:0;padding:0;">

    <div
      style="display:flex; justify-content:space-between; align-items:center; padding:16px 40px; border-bottom:4px solid #4B5563; background-color: #ccd8ca;">
      <div class="mt-4">
        <img src="/logo.png" alt="Logo" style="height:64px; display:block;">
        <div style="margin-top:8px; font-size:24px; color:#111827;">Zilmil Online Shop</div>
      </div>
      <div style="font-size:48px; font-weight: bold; color:#111827;">Invoice</div>
    </div>

    <div style="padding:32px 40px; color:#111827;font-size: medium;">
      <div style="display:flex; flex-direction: column; justify-content:space-between;">
        <div style="margin-left:auto;display:flex;flex-direction: column;align-items: center;">
          <div>
            Order ID : Z{{ order.id }}
          </div>
          <div>
            Date: {{ date() }}
          </div>
          <Barcode :value="order.c_id || '00000000'"/>
        </div>
        <div style="font-size:20px;margin-top: -25px;">
          <strong>Bill To</strong><br>
          {{order.full_name}}<br>
          {{order.phone}}<br>
          {{order.shipping_address}}
        </div>
      </div>
    </div>

    <div style="padding:16px 40px;">
      <InvoiceTable :items="order.items" :safe-colors="true" />
      <div class="flex flex-row text-md justify-end">
        <div class="flex flex-col w-30 text-right">
          <div class="px-2">Subtotal:</div>
          <div class="px-2">Shipping:</div>
          <div class="px-2">Discount:</div>
          <div class="px-2 py-1 bg-red-800 text-white">Grand Total:</div>
        </div>
        <div class="flex flex-col w-fit me-4">
          <div>{{ subTotal }} TK</div>
          <div>{{ parseInt(order.delivery_charge) }} TK</div>
          <div>{{ parseInt(order.order_discount || 0) }} TK</div>
          <div class="py-1 px-2 ps-0 border border-black bg-red-800 text-white">{{ grandTotal }} TK</div>
        </div>
      </div>
    </div>

    <div style="padding:16px 40px; color:#111827;">
      <h3 style="margin-bottom:4px;">Order Note</h3>
      <div
        style="width:40%; height:100px; background:#ffffff; border:1px solid #D1D5DB; padding:4px; overflow:hidden; box-sizing:border-box;">
        {{ order.order_note }}
      </div>
    </div>

    <div style="padding:30px 40px; display:flex; font-size: medium; justify-content:flex-end;">
      <div style="border-top:1px solid #D1D5DB; padding:4px;">Authorized Signature</div>
    </div>
    <div class="my-3"></div>
    <div style="background-color:#ccd8ca;">
      <div style="padding:10px 32px; display:flex; align-items: center; gap:16px; color:#111827;">
        <div style="display:flex; align-items: center; gap:5px;"><i class="pi pi-phone"></i> +8801331094992
        </div>
        <div style="display:flex; align-items: center; gap:5px;"><i class="pi pi-globe"></i> www.zilmil.com.bd</div>
        <div style="display:flex; align-items: center; gap:5px;"><i class="pi pi-map-marker"></i>
          Bangshal,
          Dhaka</div>
      </div>
    </div>
    <div style="height:8px; background-color:#b91c1c;"></div>
    <br>
    <div class="absolute bottom-[17px] right-[25px]">
      <VueQrCode :color="{
        dark: '#000000',
        light: '#ffffff',
      }" type="image/jpeg" :value="`https://zilmil.com.bd`" :margin="0" :width="70" />
    </div>
  </div>
</template>

<script setup>
import { computed, getCurrentInstance, onMounted, ref } from 'vue'
import html2canvas from 'html2canvas-pro'
import jsPDF from 'jspdf'
import InvoiceTable from './InvoiceTable.vue'
import VueQrCode from 'vue-qrcode'
import Barcode from './Barcode.vue'

const props = defineProps({
  order: {
    type: Object,
    default: () => ({
      id: 1,
      items: [
        { product: { name: 'Gloves', quantity: 2, price: 200, net_price: 100 }, quantity: 2 },
        { product: { name: 'Shoes', quantity: 1, price: 220, net_price: 120 }, quantity: 1 },
      ],
      delivery_charge: 60,
      order_note: 'This is an example note for the order.',
    }),
  },
  injectInvoiceRef: {
    type: Function,
    required: false
  }
})
const subTotal = computed(() =>
  props.order.items.reduce((sum, item) => sum + item.quantity * getPrice(item), 0)
)
const grandTotal = computed(() => (subTotal.value + (parseInt(props.order.delivery_charge) - (props.order.order_discount || 0)) || 0))

function formatDate(d) {
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}
const date = () => formatDate(new Date())

function getPrice(item) {
  if (item.product.net_price) return item.product.net_price
  return item.product.price
}

const invoice = ref(null)

async function dwnld() {
  if (!invoice.value) return;

  console.log('dwnld')
  try {
    // 1ï¸â£ Render element with html2canvas (high resolution)
    const originalCanvas = await html2canvas(invoice.value, {
      scale: 2,
      backgroundColor: null,
      allowTaint: false,
      useCORS: true
    });

    // 2ï¸â£ Resize to EXACT required size (1750 Ã 2480 px)
    const targetWidth = 1750;
    const targetHeight = 2480;

    const resizedCanvas = document.createElement("canvas");
    resizedCanvas.width = targetWidth;
    resizedCanvas.height = targetHeight;

    const ctx = resizedCanvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    ctx.drawImage(
      originalCanvas,
      0, 0, originalCanvas.width, originalCanvas.height,
      0, 0, targetWidth, targetHeight
    );

    // Convert to PNG
    const imgData = resizedCanvas.toDataURL("image/png");

    // 3ï¸â£ Convert pixel size â PDF points (300 DPI)
    // width_px / 300 * 72
    const pdfWidth = (1750 / 300) * 72;   // â 420 pt
    const pdfHeight = (2480 / 300) * 72;  // â 595 pt

    // 4ï¸â£ Create PDF with exact size
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: [pdfWidth, pdfHeight]   // Custom exact page size
    });

    // Add image to PDF
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    // 5ï¸â£ Save PDF
    pdf.save(`order_${props.order.id}.pdf`);

  } catch (e) {
    console.error("Failed")
}}

defineExpose({ dwnld })

onMounted(() => {
  console.log(props.order)
  if (props.injectInvoiceRef) {
    const instance = getCurrentInstance()
    props.injectInvoiceRef(props.order.id, { dwnld })
  }
})
</script>

<style scoped>
*{border:0px solid transparent;}
</style>
 