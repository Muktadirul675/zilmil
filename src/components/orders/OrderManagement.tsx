'use client';

import { useOrders } from "@/stores/orders";
import { Color, Order as POrder, OrderItem as POrderItem, Product as PProduct, Image as ProdImage, Variant } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

export interface Product extends PProduct {
    images: ProdImage[]
}

export interface OrderItem extends POrderItem {
    product: Product,
    variant: Variant | null,
    color: Color | null
}

export interface Order extends POrder {
    items: OrderItem[]
}

export default function OrderManagement() {
    const orders = useOrders()

    return <div className="">
        {JSON.stringify(orders)}
    </div>
}

export function OrderTable({ orders, status }: { orders: Order[], status: string }) {
    const [searchStr, setSearchStr] = useState<string>('')
    const filteredOrders = useMemo(()=>{
        if(searchStr === ''){
            return orders;
        }else{
            return orders.filter((o)=>{
                return o.name.toLowerCase().includes(searchStr) || o.address.toLowerCase().includes(searchStr) || o.id.toLowerCase().includes(searchStr)
            })
        }
    },[searchStr])
    return <>
        <div className="hidden">{status}</div>
        <div className="flex flex-col flex-wrap">
            <input value={searchStr} onChange={(e) => setSearchStr(e.target.value)} type="text" className="form-input my-2 w-full md:w-max-[600px]" placeholder="Search" />
            <div className="w-full max-w-[300px] md:max-w-[600px] lg:max-w-full overflow-x-auto">
                <table className="border w-full border-gray-300 text-sm text-left text-gray-500">
                    <thead className="bg-gray-200 text-gray-700 uppercase">
                        <tr>
                            <th className="px-6 py-3">id</th>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Address</th>
                            <th className="px-6 py-3">Price</th>
                            <th className="px-6 py-3">Inside Dhaka</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order) => {
                            return <>
                                <tr key={order.id} className="odd:bg-gray-100 hover:bg-gray-50">
                                    <td className="px-6 py-4">{order.id}</td>
                                    <td className="px-6 py-4">{order.name}</td>
                                    <td className="px-6 py-4">{order.address}</td>
                                    <td className="px-6 py-4">{order.order_price}</td>
                                    <td className="px-6 py-4">{order.inside_dhaka}</td>
                                </tr>
                                <tr className="even:bg-gray-100 hover:bg-gray-50 w-full">
                                    <td colSpan={5} className="my-1">
                                        <div className="flex flex-row">
                                            {order.items.map((item) => {
                                                return <div key={item.id} className="flex flex-col mx-2">
                                                    <Image src={item.product.images[0].url} alt="Image" height={80} width={80} className="rounded h-[80px] w-[80px]" />
                                                    <Link className="text-black font-bold" href={`/products/${item.product.slug}`}>{item.product.name}</Link>
                                                    <h3 className="font-bold">{item.variant?.name}</h3>
                                                    <h3 className="font-bold">{item.color?.name}</h3>
                                                </div>
                                            })}
                                        </div>
                                    </td>
                                </tr>
                            </>
                        })}
                    </tbody>
                </table >
            </div >
        </div >
    </>
}