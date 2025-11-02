<template>
  <button class="btn" @click.stop="dwnld">Download</button>
  <div ref="invoice" class="invoice-container relative"
    style="height:auto;width:800px; background:#ffffff; box-sizing:border-box; font-family:Arial, sans-serif; font-size:14px; overflow:hidden;margin:0;padding:0;">

    <div
      style="display:flex; justify-content:space-between; align-items:center; padding:16px 40px; border-bottom:4px solid #4B5563;">
      <div>
        <img src="/logo.png" alt="Logo" style="height:64px; display:block;">
        <div style="margin-top:8px; font-size:18px; color:#111827;">Zilmil Online Shopping</div>
      </div>
      <div style="font-size:24px; color:#111827;">Invoice</div>
    </div>

    <div style="padding:16px 40px; color:#111827;">
      <div style="display:flex; flex-direction: column; justify-content:space-between;">
        <div style="margin-left:auto">
          Order ID : Z{{ order.id }}<br>
          Date: {{ date() }}
        </div>
        <div>
          <strong>Bill To</strong><br>
          Mehadi Hasan<br>
          018284818712<br>
          Bangshal, Dhaka
        </div>
      </div>
    </div>

    <div style="padding:16px 40px;">
      <InvoiceTable :items="order.items" :safe-colors="true" />
      <div style="text-align:right;">
        <div style="margin-block:4px;">Subtotal: {{ subTotal }}</div>
        <div style="margin-block:4px;">Shipping: {{ parseInt(order.delivery_charge) }}</div>
        <div style="
          width:fit-content;
       padding:4px 8px; 
       background-color:#b91c1c; 
       color:#ffffff; 
       min-width:120px;
       text-align:right;
       margin-left:auto
    ">
          Grand Total: {{ grandTotal }}
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

    <div style="padding:16px 40px; display:flex; justify-content:flex-end;">
      <div style="border-top:1px solid #D1D5DB; padding:4px;">Authorized Signature</div>
    </div>

    <div style="padding:16px 32px; display:flex; align-items: center; gap:16px; color:#111827;">
      <div style="display:flex; align-items: center; gap:5px;color:#ef4444;"><i class="pi pi-phone"></i> 018284818712
      </div>
      <div style="display:flex; align-items: center; gap:5px;"><i class="pi pi-globe"></i> www.zilmil.com.bd</div>
      <div style="display:flex; align-items: center; gap:5px;color:#ef4444;"><i class="pi pi-map-marker"></i> Bangshal,
        Dhaka</div>
    </div>

    <div style="height:4px; background-color:#4B5563;"></div>
    <div style="height:6px; background-color:#b91c1c;"></div>
    <br>
    <div class="absolute bottom-[8px] right-[25px]">
      <VueQrCode :value="`https://zilmil.com.bd`" :margin="0" :width="40"/>
    </div>
  </div>
</template>

<script setup>
import { computed, getCurrentInstance, onMounted, ref } from 'vue'
import html2canvas from 'html2canvas-pro'
import jsPDF from 'jspdf'
import InvoiceTable from './InvoiceTable.vue'
import VueQrCode from 'vue-qrcode'

const props = defineProps({
  order: {
    type: Object,
    default: () => ({
      id: 1,
      items: [
        { product: { name: 'Gloves', quantity: 2, price: 200, net_price: 100 }, quantity:2 },
        { product: { name: 'Shoes', quantity: 1, price: 220, net_price: 120 }, quantity:1 },
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
const grandTotal = computed(() => subTotal.value + (parseInt(props.order.delivery_charge) || 0))

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

  try {
    // 1ï¸â£ Render invoice to canvas in main thread
    const canvas = await html2canvas(invoice.value, {
      scale: 2,
      backgroundColor: null
    });

    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = canvas.width;
    const pdfHeight = canvas.height;

    // 2ï¸â£ Send canvas image to worker
    const worker = new Worker(new URL('@/workers/pdfWorker.js', import.meta.url));

    worker.onmessage = (e) => {
      const { pdfBlob, error } = e.data;
      if (error) {
        console.error('Worker error:', error);
        return;
      }

      // 3ï¸â£ Trigger download in main thread
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `order_${props.order.id}.pdf`;
      link.click();
      URL.revokeObjectURL(url);

      worker.terminate(); // stop the worker after done
    };

    worker.postMessage({
      id: props.order.id,
      htmlContent: imgData, // canvas as base64
      width: pdfWidth,
      height: pdfHeight
    });

  } catch (e) {
    console.error('Failed to generate PDF:')
  }
}

defineExpose({ dwnld })

onMounted(() => {
  console.log(props.order)
  if (props.injectInvoiceRef) {
    const instance = getCurrentInstance()
    props.injectInvoiceRef(props.order.id, { dwnld })
  }
})
</script>