'use client';

import { Item } from "@/stores/cart";
import { useOrders } from "@/stores/orders";
import { useEffect, useMemo, useState } from "react";
import { OrderItem } from "./OrderManagement";
import Image from "next/image";


export default function OrdersPending() {
    const orders = useOrders()
    useEffect(() => {
        orders.fetchOrders()
    }, [])
    const [courier, setCourier] = useState<string>('')
    const [searchStr, setSearchStr] = useState<string>('')
    const [zone, setZone] = useState<string>('')
    const [city, setCity] = useState<string>('')
    const filtered = useMemo(() => {
        if (searchStr === '') {
            return orders.pending
        } else {
            return orders.pending.filter((ord) => {
                return ord.id.toLowerCase().includes(searchStr.toLowerCase()) || ord.name.toLowerCase().includes(searchStr.toLowerCase()) || ord.address.toLowerCase().includes(searchStr.toLowerCase())
            })
        }
    }, [searchStr, orders.pending])
    return <div className="flex flex-col p-3">
        {filtered.map((order) => {
            interface Item extends OrderItem {
                count: number
            }
            const items: Item[] = []
            for (const c of order.items) {
                let found = false;
                for (const i of items) {
                    if (c.colorId && c.variantId) {
                        if (c.product.id === i.product.id && c.variantId === i.variant?.id && c.colorId === i.color?.id) {
                            i.count = i.count + 1;
                            found = true;
                            break;
                        }
                    } else if (c.colorId) {
                        if (c.product.id === i.product.id && c.colorId === i.color?.id) {
                            i.count = i.count + 1;
                            found = true;
                            break;
                        }
                    } else if (c.variantId) {
                        if (c.product.id === i.product.id && c.variantId === i.variant?.id) {
                            i.count = i.count + 1;
                            found = true;
                            break;
                        }
                    } else {
                        if (c.product.id === i.product.id) {
                            i.count = i.count + 1;
                            found = true;
                            break;
                        }
                    }
                }
                if (!found) {
                    items.push({ ...c, count: 1 })
                }
            }
            return <div key={order.id} className="py-2 flex flex-col md:flex-row shadow my-2">
                <div className="w-full md:w-1/2 p-3">
                    <h3 className="text-lg font-bold">
                        {order.name}
                    </h3>
                    <h3 className="text-lg font-bold">
                        {order.phone}
                    </h3>
                    <h3 className="text-lg font-bold">
                        {order.address}
                    </h3>
                </div>
                <div className="w-full md:w-1/2 p-3">
                    {items.map((prod) => {
                        return <div key={prod.id} className="p-3 border-b w-full">
                            <div className="font-bold flex items-center">
                                <Image src={prod.product.images[0].url} className="rounded w-[80px] h-[80px]" alt="Image" width={80} height={80} />
                                <div className="ms-3 ">
                                    {prod.product.name}
                                    <span className="mx-2"></span> X {prod.count}
                                    {prod.variant !== null && <h3>
                                        {prod.variant?.name}
                                    </h3>}
                                    {prod.color !== null && <h3>
                                        {prod.color?.name}
                                    </h3>}
                                </div>
                            </div>
                        </div>
                    })}
                </div>
                <div>Select Courier</div>
                <div>
                    <input type="radio" name="courier" checked={courier === 'steadfast'} id="" /> Steadfast
                    <input type="radio" name="courier" checked={courier === 'pathao'} id="" /> Pathao
                </div>
                {courier === 'pathao' && <div>

                </div>}
            </div>
        })}
    </div>
}
