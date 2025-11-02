<template>
  <div>
    <div style="overflow-x:auto;">
      <table style="width:100%; border-collapse: collapse; border-bottom:2px solid #D1D5DB; font-family: Arial, sans-serif; font-size:14px;">
        <thead>
          <tr style="">
            <th style="background-color:#111827; color:#ffffff; text-align:left; padding:8px; width:fit-content;">SL</th>
            <th style="background-color:#b91c1c; color:#ffffff; text-align:left; padding:8px; width:50%;">Description</th>
            <th style="background-color:#111827; color:#ffffff; text-align:left; padding:8px; width:15%;">Quantity</th>
            <th style="background-color:#b91c1c; color:#ffffff; text-align:left; padding:8px; width:15%;">Price</th>
            <th style="background-color:#111827; color:#ffffff; text-align:left; padding:8px; width:15%;">Total</th>
          </tr>
        </thead>

        <tbody>
          <!-- Actual items -->
          <tr v-for="(item, index) in items" :key="index" style="height:30px;">
            <td style="background-color:#f3f4f6; padding:8px;">{{ index + 1 }}</td>
            <td style="background-color:#ffffff; padding:8px;">{{ item.product.name }}</td>
            <td style="background-color:#f3f4f6; padding:8px;">{{ item.quantity }}</td>
            <td style="background-color:#ffffff; padding:8px;">{{ getPrice(item) }}</td>
            <td style="background-color:#f3f4f6; padding:8px;">{{ (item.quantity * getPrice(item)) }}</td>
          </tr>

          <!-- Fill remaining space to keep 300px min height -->
          <tr
            v-if="items.length < minRows"
            v-for="n in minRows - items.length"
            :key="'empty-' + n"
            style="height:30px;"
          >
            <td style="background-color:#f3f4f6;"></td>
            <td style="background-color:#ffffff;"></td>
            <td style="background-color:#f3f4f6;"></td>
            <td style="background-color:#ffffff;"></td>
            <td style="background-color:#f3f4f6;"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    default: () => [
      { name: 'Gloves', quantity: 2, price: 100 },
      { name: 'Shoes', quantity: 1, price: 120 }
    ]
  }
})

function getPrice(item){
  if(item.product.net_price) return parseInt(item.product.net_price)
  return parseInt(item.product.price)
}

const minRows = 6
</script>