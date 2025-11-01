<template>

  <button @click="dwnld"
    style="">Download</button>

    <div ref="invoice" class="invoice-container"
      style="border:2px solid black;height:auto;width:800px; background:#ffffff; box-sizing:border-box; font-family:Arial, sans-serif; font-size:14px; overflow:hidden;margin:0;padding:0;">

      <div
        style="display:flex; justify-content:space-between; align-items:center; padding:16px 40px; border-bottom:4px solid #4B5563;">
        <div>
          <img src="/logo.png" alt="Logo" style="height:64px; display:block;">
          <div style="margin-top:8px; font-size:18px; color:#111827;">Zilmil Online Shopping</div>
        </div>
        <div style="font-size:24px; color:#111827;">Invoice</div>
      </div>

      <div style="padding:16px 40px; color:#111827;">
        <div style="display:flex; justify-content:space-between;">
          <div>
            <strong>Bill To</strong><br>
            Mehadi Hasan<br>
            018284818712<br>
            Bangshal, Dhaka
          </div>
          <div>
            Order ID : Z{{ order.id }}<br>
            Date: {{ date() }}
          </div>
        </div>
      </div>

      <div style="padding:16px 40px;">
        <InvoiceTable :items="order.items" :safe-colors="true" />
        <div style="text-align:right;">
          <div style="margin-bottom:4px;">Subtotal: {{ subTotal }}</div>
          <div style="margin-bottom:4px;">Shipping: {{ order.shipping }}</div>
          <div style="
          width:fit-content;
       padding:4px 8px; 
       background-color:#b91c1c; 
       color:#ffffff; 
       min-width:120px;
       text-align:right;
       margin-top: 10px;
       padding-bottom:20px;
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
          {{ order.note }}
        </div>
      </div>

      <div style="padding:16px 40px; display:flex; justify-content:flex-end;">
        <div style="border-top:1px solid #D1D5DB; padding:4px;">Authorized Signature</div>
      </div>

      <div style="padding:16px 32px; display:flex; align-items: center; gap:16px; color:#111827;">
        <div style="display:flex; align-items: center; gap:5px;color:#ef4444;"><i class="pi pi-phone"></i> 018284818712</div>
        <div style="display:flex; align-items: center; gap:5px;"><i class="pi pi-globe"></i> www.zilmil.com.bd</div>
        <div style="display:flex; align-items: center; gap:5px;color:#ef4444;"><i class="pi pi-map-marker"></i> Bangshal, Dhaka</div>
      </div>

      <div style="height:2px; background-color:#4B5563;"></div>
      <div style="height:4px; background-color:#b91c1c;"></div> 
      
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import InvoiceTable from './InvoiceTable.vue'

const props = defineProps({
  order: {
    type: Object,
    default: () => ({
      id: 1,
      items: [
        { name: 'Gloves', quantity: 2, price: 100 },
        { name: 'Shoes', quantity: 1, price: 120 },
      ],
      shipping: 60,
      note: 'This is an example note for the order.',
    }),
  },
})

const subTotal = computed(() =>
  props.order.items.reduce((sum, item) => sum + item.quantity * item.price, 0)
)
const grandTotal = computed(() => subTotal.value + (props.order.shipping || 0))

function formatDate(d) {
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}
const date = () => formatDate(new Date())

const invoice = ref(null)
async function dwnld() {
  if (!invoice.value) return
  try {
    const canvas = await html2canvas(invoice.value, { scale: 2, scrollY:-window.scrollY, backgroundColor:null, height:1200, width:800 })
    const imgData = canvas.toDataURL('image/png')
    const h = 1200, w=800;
    const pdf = new jsPDF('p', 'pt', [canvas.width, canvas.height])
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
    pdf.save(`order_${props.order.id}.pdf`)
  } catch (e) {
    console.error('Failed to generate PDF:', e)
  }
}
</script>