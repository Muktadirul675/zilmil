<template>
  <div>
    <div style="overflow-x:auto;">
      <table style="width:100%; border-collapse: collapse; border-bottom:2px solid #D1D5DB; font-family: Arial, sans-serif; font-size:14px;">
        <thead>
          <tr style="">
            <th style="background-color:#111827; color:#ffffff; text-align:center; padding:8px; width:fit-content;">SL</th>
            <th style="background-color:#b91c1c; color:#ffffff; text-align:center; padding:8px; width:50%;">Description</th>
            <th style="background-color:#111827; color:#ffffff; text-align:center; padding:8px; width:15%;">Quantity</th>
            <th style="background-color:#b91c1c; color:#ffffff; text-align:center; padding:8px; width:15%;">Price</th>
            <th style="background-color:#111827; color:#ffffff; text-align:center; padding:8px; width:15%;">Total</th>
          </tr>
        </thead>

        <tbody>
          <!-- Actual items -->
          <tr v-for="(item, index) in items" :key="index" style="height:30px;">
            <td class="text-lg" style="background-color:#f3f4f6; text-align:center; padding:8px;">{{ index + 1 }}</td>
            <td class="text-lg" style="background-color:#ffffff; text-align:center; padding:8px;">{{ constructName(item) }}</td>
            <td class="text-lg" style="background-color:#f3f4f6; text-align:center; padding:8px;">{{ item.quantity }}</td>
            <td class="text-lg" style="background-color:#ffffff; text-align:center; padding:8px;">{{ getPrice(item) }}</td>
            <td class="text-lg" style="background-color:#f3f4f6; text-align:center; padding:8px;">{{ (item.quantity * getPrice(item)) }}</td>
          </tr>

          <!-- Fill remaining space to keep 300px300px min height -->
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

const minRows = 10

function constructName(item){
  let s = item.product.name;
  let v = item.variant?.name;
  let c = item.color?.name;
  if(v||c){
    s += ' ('
  }
  if(v) s+=v;
  if(v && c) s+= ', ';
  if(c) s+= c;
  if(v||c){
    s += ')'
  }
  return s;
}
</script>