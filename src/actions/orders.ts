'use server';


// /**
//  * To Create Order
//  * @type <POST>
//  * Pass below mentioned parameter
//  *
//    store_id <required, numeric>
//    merchant_order_id    <nullable, string>
//    sender_name  <required, numeric>
//    sender_phone     <required, string/>
//    recipient_name   <required, string>
//    recipient_phone  <required, string>
//    recipient_address    <required, string, Min:10>
//    recipient_city   <required, numeric>
//    recipient_zone   <required, numeric>
//    recipient_area   <required, numeric>
//    delivery_type    <required, numeric> is provided by the merchant and not changeable. 48 for Normal Delivery, 12 for On Demand Delivery"
//    item_type    <required, numeric> is provided by the merchant and not changeable. 1 for Document, 2 for Parcel"
//    special_instruction  <nullable, string>
//    item_quantity    <required, numeric>
//    item_weight  <required, numeric>
//    amount_to_collect    <required, numeric>
//    item_description     <nullable, string>
//  */

export async function placeOrder(formData: FormData) {
    const store_id = process.env.STORE_ID
    const merchant_order_id = formData.get('order_id')
    const sender_name = 'Md Mehedi Hasan'
    const sender_phone = '01331094992'
    const name = formData.get('name')
    const address = formData.get('address')
    const phone = formData.get('phone')
    const city = parseInt(formData.get('city')?.toString() ?? '')
    const area = parseInt(formData.get('area')?.toString() ?? '')
    const zone = parseInt(formData.get('zone')?.toString() ?? '')
    const del_type = 48
    const item_type = 2
    const quantity = parseInt(formData.get("quantity")?.toString() ?? '1')
    const weight = parseFloat(formData.get('weight')?.toString() ?? '0.5')
    const amount = parseInt(formData.get('amount')?.toString() ?? '0')

    const payload = {
        store_id: store_id,
        merchant_order_id: merchant_order_id,
        sender_name: sender_name,
        sender_phone: sender_phone,
        recipient_name: name,
        recipient_phone: phone,
        recipient_address: address,
        recipient_city: city,
        recipient_zone: zone,
        recipient_area: area,
        delivery_type: del_type,
        item_type: item_type,
        item_quantity: quantity,
        item_weight: weight,
        amount_to_collect: amount
    }
    await fetch(`${process.env.PATHAO_URL}/create_order`,{
        method: 'POST',
        body: JSON.stringify(payload)
    })
}
