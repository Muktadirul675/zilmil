'use client';

import { useOrders } from "@/stores/orders";
import { Color, Order as POrder, OrderItem as POrderItem, Product as PProduct, Image as ProdImage, Variant } from "@prisma/client";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { perPageOrder } from "@/app/api/order/route";

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

export interface Item {
    product: Product,
    count: number,
    variant: Variant | null,
    color: Color | null,
    cartid: string
}


function OrderTr({ order }: { order: Order }) {
    const items = useMemo(() => {
        const newItems: Item[] = []
        for (const c of order.items) {
            console.log('c', c)
            let found = false;
            for (const i of newItems) {
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
                // console.log('ni', { product: c.product, count: 1, variant: c.variant, color: c.color, cartid: c.id })
                newItems.push({ product: c.product, count: 1, variant: c.variant, color: c.color, cartid: c.id })
            }
        }
        return newItems
    }, [order])
    return <tr key={order.id} className="border-b p-3 cursor-pointer odd:bg-gray-100 hover:bg-gray-50 align-top">
        <td className="px-3 py-2">{order.id.slice(0, 5)}...</td>
        <td className="px-3 py-2">{`${new Date(order.created_at).getDate()}`}</td>
        <td className="px-3 py-2">{order.name}</td>
        <td className="px-3 py-2">
            {items.map((prod) => {
                return <span className="block">{prod.product.name} X {prod.count}</span>
            })}
        </td>
        <td className="px-3 py-2">{order.order_price}</td>
        <td className="px-3 py-2">100%</td>
        <td className="px-3 py-2">{order.status}</td>
        <td className="px-3 py-2">Facebook</td>
    </tr>
}

function PaginationBar({count, set}:{count: number, set: Dispatch<SetStateAction<number>>}) {
    const items = []
    const [active, setActive] = useState<number>(1)
    for (let i = 1; i <= count; i++) {
        items.push(i)
    }
    return items.map((i) => {
        return <span key={i} onClick={() =>{
            setActive(i)
            set(i)
        }} className={`mx-2 px-2 py-1 cursor-pointer rounded hover:bg-red-200 transition-all ${active === i && 'bg-red-400 text-white'}`}>
            <div className="bg-red-400 hidden text-white"></div>
            {i}
        </span>
    })
}

export default function Orders() {
    const selectionRange = {
        start: new Date(),
        end: new Date(),
        key: ''
    }

    const [activePage, setActivePage] = useState<number>(1)
    const [activeOrders, setActiveOrders] = useState<Order[]>([])
    const orders = useOrders()

    const totalPages = useMemo(() => {
        const total = orders.counts.count
        let pageCount = (total / perPageOrder)
        if (total % perPageOrder) {
            pageCount++;
        }
        return pageCount;
    }, [orders.counts])

    async function get() {
        const o = await orders.getPage(activePage)
        setActiveOrders(o)
    }

    useEffect(() => {
        get()
    }, [activePage])

    return <div className="p-3">
        <h3 className="text-lg font-bold">Orders List</h3>
        <div className="flex my-4">
            <div className="w-1/5 p-2 border-r flex justify-center">
                <div>
                    <h3 className="text-gray-400">
                        Total Orders
                    </h3>
                    <h3 className="text-xl font-bold">
                        {orders.counts.count}
                    </h3>
                </div>
            </div>
            <div className="w-1/5 p-2 border-r flex justify-center">
                <div>
                    <h3 className="text-gray-400">
                        New Orders
                    </h3>
                    <h3 className="text-xl font-bold">
                        {orders.counts.pending}
                    </h3>
                </div>
            </div>
            <div className="w-1/5 p-2 border-r flex justify-center">
                <div>
                    <h3 className="text-gray-400">
                        Confirmed
                    </h3>
                    <h3 className="text-xl font-bold">
                        {orders.counts.confirmed}
                    </h3>
                </div>
            </div>
            <div className="w-1/5 p-2 border-r flex justify-center">
                <div>
                    <h3 className="text-gray-400">
                        Delivered
                    </h3>
                    <h3 className="text-xl font-bold">
                        {orders.counts.delivered}
                    </h3>
                </div>
            </div>
            <div className="w-1/5 p-2 flex justify-center">
                <div>
                    <h3 className="text-gray-400">
                        Returned
                    </h3>
                    <h3 className="text-xl font-bold">
                        {orders.counts.returned}
                    </h3>
                </div>
            </div>
        </div>
        <div className="w-full border rounded">
            <div className="p-3 flex items-center">
                <input type="text" name="" placeholder="Search by order id or name" id="" className="form-input" />
                <div className="ms-auto flex items-center">
                    <select className="px-2 py-1 bg-transparent border rounded me-2">
                        <option value="">All Status</option>
                        <option value="">Pending</option>
                        <option value="">Delivered</option>
                        <option value="">Returned</option>
                    </select>
                    {/* <DateRangePicker
                        ranges={[selectionRange]}
                    /> */}
                </div>
            </div>
            <table className="min-w-full">
                <thead>
                    <tr className="bg-slate-200 font-bold">
                        <td className="px-3 py-2">Order Id</td>
                        <td className="px-3 py-2">Date</td>
                        <td className="px-3 py-2">Customer</td>
                        <td className="px-3 py-2">Products</td>
                        <td className="px-3 py-2">Amount</td>
                        <td className="px-3 py-2">Rating</td>
                        <td className="px-3 py-2">Status</td>
                        <td className="px-3 py-2">Origin</td>
                    </tr>
                </thead>
                <tbody>
                    {activeOrders.map((order) => {
                        return <OrderTr key={order.id} order={order} />
                    })}
                </tbody>
            </table>
        </div>
        <div className="flex my-1 justify-between items-center">
            <div onClick={()=>{
                    if(!(activePage === 1)){
                        setActivePage((prev)=>prev-1)
                    }
                }}  className="cursor-pointer flex items-center border px-2 py-1">
                <BsArrowLeft /> <div className="mx-1"></div> Previous
            </div>
            <div className="flex items-center justify-center flex-grow">
                <PaginationBar set={setActivePage} count={totalPages}/>
            </div>
            <div onClick={()=>{
                if(!(activePage === totalPages)){
                    setActivePage((prev)=>prev+1)
                }
            }} className="cursor-pointer flex items-center border px-2 py-1">
                <BsArrowRight /> <div className="mx-1"></div> Next
            </div>
        </div>
    </div>
}