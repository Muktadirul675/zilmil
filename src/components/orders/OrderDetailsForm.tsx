'use client'

import { useCallback, useEffect, useMemo, useState } from "react"
import React from "react";
import { Area, Zone, usePathao } from "@/stores/pathao";
import Image from "next/image";
import toast from "react-hot-toast";
import { BiMinus, BiPlus } from "react-icons/bi";
import { useProducts } from "@/stores/products";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";
import { useOrders } from "@/stores/orders";

interface Product {
    name: string;
    id: string;
    stocks: number;
    price: number;
    discounted_price: number | null;
    images: {
        id: string;
        created_at: Date;
        updated_at: Date;
        productId: string;
        url: string;
        index: number;
        caption: string | null;
    }[];
    variants: {
        id: string,
        name: string,
        stocks: number
    }[],
    colors: {
        id: string,
        name: string,
        stocks: number,
        hex: string
    }[],
}[]

interface Item {
    uid: number,
    count: number,
    product: Product,
    variant: {
        id: string,
        name: string
    } | null,
    color: {
        id: string,
        name: string
    } | null
}

interface OrderItem {
    product: Product,
    variant: {
        id: string,
        name: string
    } | null,
    color: {
        id: string,
        name: string
    } | null
}

// interface Variant{
//     id: string
// }

export interface Order {
    id: string,
    name: string,
    address: string,
    phone: string,
    courier: string | null,
    items: OrderItem[],
    order_price: number,
    note: string | null,
    inside_dhaka: boolean,
    zone?: number | null,
    city?: number | null,
    area?: number | null,
}

let lastUid = 0;

function Label({ children, htmlFor }: { children: React.ReactNode, htmlFor: string }) {
    return <label htmlFor={htmlFor} className="text-lg font-bold">{children}</label>
}

function AddProduct({ product, add }: { product: Product, add: (item: Item) => void }) {
    const [count, setCount] = useState<number>(1)

    function inc() {
        setCount((prev) => prev + 1)
    }
    function dec() {
        if (count > 1) {
            setCount((prev) => prev - 1)
        }
    }
    const [variant, setVariant] = useState<{ name: string, id: string } | null>(null)
    const [color, setColor] = useState<{ name: string, id: string } | null>(null)

    function addProduct() {
        if (product.variants.length && variant === null) {
            toast.error("Must select a variant")
            return
        }
        if (product.colors.length && color === null) {
            toast.error("Must select a color")
            return
        }
        if (count <= 0) {
            toast.error("Must be more than 0")
            return
        }
        const it: Item = { color: color, count: count, product: product, uid: lastUid++, variant: variant }
        add(it)
    }

    return <div className="w-full flex flex-wrap my-1">
        <div className="">
            <Image alt="Image" src={product.images[0].url} height={100} width={100} className="w-[100px] h-[100px] rounded" />
        </div>
        <div className="flex-grow p-3">
            <h3>{product.name}</h3>
            {variant && <h3>{variant.name}</h3>}
            {color && <h3>{color.name}</h3>}
            {product.variants.length > 0 && <div className="flex items-start w-1/2 my-1">
                {product.variants.map((va) => {
                    return <div onClick={() => setVariant({ name: va.name, id: va.id })} className="border p-3 bg-white">{va.name}</div>
                })}
            </div>}
            {product.colors.length > 0 && <div className="flex items-start w-1/2 my-1">
                {product.colors.map((va) => {
                    return <div onClick={() => setColor({ name: va.name, id: va.id })} className="border h-[30px] w-[30px] rounded-full" style={{ backgroundColor: va.hex }}></div>
                })}
            </div>}
        </div>
        <div className="flex-grow flex flex-col items-end">
            <div className="my-1 flex">
                <BiMinus onClick={dec} className="text-2xl cursor-pointer border border-r-0" />
                <input type="number" name="" className="remove-arrow w-10 border text-center border-l-0 border-r-0" value={count} onChange={(e) => setCount(parseInt(e.target.value))} id="" />
                <BiPlus onClick={inc} className="text-2xl cursor-pointer border border-l-0" />
            </div>
            <button type="button" onClick={addProduct} className="btn">Add</button>
        </div>
    </div>
}

export default function OrderDetailsForm({ order }: { order: Order }) {
    const [name, setName] = useState<string>(order.name)
    const [address, setAddress] = useState<string>(order.address)
    const [phone, setPhone] = useState<string>(order.phone)
    const [subTotal, setSubTotal] = useState<number>(0)
    const products = useProducts()
    const [courier, setCourier] = useState<string>(order.courier ?? 'pathao')
    const [insideDhaka, setInsideDhaka] = useState<boolean>(true)
    const [quantity, setQuantity] = useState<number>(0)
    const [weight, setWeight] = useState<string>('0.5')
    const [items, setItems] = useState<Item[]>([])
    const [note, setNote] = useState<string>('')

    const total = useMemo(() => {
        return subTotal + (insideDhaka ? 60 : 110)
    }, [insideDhaka, subTotal])

    useEffect(() => {
        const newItems: Item[] = []
        for (const c of order.items) {
            console.log('c', c)
            let found = false;
            for (const i of newItems) {
                if (c.color?.id && c.variant?.id) {
                    if (c.product.id === i.product.id && c.variant?.id === i.variant?.id && c.color?.id === i.color?.id) {
                        i.count = i.count + 1;
                        found = true;
                        break;
                    }
                } else if (c.color?.id) {
                    if (c.product.id === i.product.id && c.color?.id === i.color?.id) {
                        i.count = i.count + 1;
                        found = true;
                        break;
                    }
                } else if (c.variant?.id) {
                    if (c.product.id === i.product.id && c.variant?.id === i.variant?.id) {
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
                console.log('ni', { uid: lastUid++, product: c.product, count: 1, variant: c.variant, color: c.color })
                newItems.push({ uid: lastUid++, product: c.product, count: 1, variant: c.variant, color: c.color })
            }
        }
        setItems(newItems)
    }, [order])

    const addItem = useCallback((item: Item) => {
        setItems((prev) => [...prev, item])
    }, [products, items])

    const removeItem = useCallback((item: Item) => {
        setItems((prev) => prev.filter((p) => p.uid !== item.uid))
    }, [products, items])

    useEffect(() => {
        let count = 0;
        let pri = 0;
        for (const i of items) {
            count += i.count
            pri += i.product.discounted_price ? i.product.discounted_price : i.product.price
        }
        setQuantity(count)
        setSubTotal(pri)
    }, [items])

    const router = useRouter()
    const orders = useOrders()
    const pathao = usePathao()

    const [zones, setZones] = useState<Zone[]>([])
    const [areas, setAreas] = useState<Area[]>([])

    const [city, setCity] = useState<number | null>(null)
    const [zone, setZone] = useState<number | null>(null)
    const [area, setArea] = useState<number | null>(null)

    const getZones = useCallback(async () => {
        if (!city) {
            setZones([])
            return
        }
        const zs = await pathao.getZones(city)
        setZones(zs)
    }, [city])

    useEffect(() => {
        getZones()
    }, [city])

    const getAreas = useCallback(async () => {
        if (!zone) {
            setAreas([])
            return
        }
        const as = await pathao.getAreas(zone)
        setAreas(as)
    }, [zone])

    useEffect(() => {
        getAreas()
    }, [zone])

    useEffect(() => {
        let adrs = address?.replace(',', ' ')
        adrs = adrs?.replace('-', ' ')
        for (const c of zones) {
            if (adrs?.toLowerCase().includes(c.name.toLowerCase())) {
                setZone(c.id)
                break;
            }
        }
    }, [address, zones])

    useEffect(() => {
        let adrs = address?.replace(',', ' ')
        adrs = adrs?.replace('-', ' ')
        for (const c of pathao.cities) {
            if (adrs?.toLowerCase().includes(c.name.toLowerCase())) {
                setCity(c.id)
                break;
            }
        }
    }, [address, pathao.cities])

    const [adding, setAdding] = useState<boolean>(false)

    async function addOrder() {
        setAdding(true)
        if (name === '' || address === '' || phone === '') {
            toast.error("Please provide name, address and phone number")
            setAdding(false)
            return
        }
        if (items.length === 0) {
            toast.error("Please select more than 1 item")
            setAdding(false)
            return
        }
        if (courier === 'pathao') {
            if (!city || !zone) {
                toast.error("Please select both city and zones")
                setAdding(false)
                return
            }
        }
        const payload = {
            id: order.id,
            address: address,
            courier: courier,
            inside_dhaka: insideDhaka,
            items: items,
            name: name,
            note: note,
            order_price: total,
            phone: phone,
            area: area,
            city: city,
            zone: zone
        }
        orders.editOrder(order.id,payload)
        setAdding(false)
        router.push("/admin/orders")
    }

    return <form className="flex flex-row">
        <div className="flex flex-col w-1/2">
            <Label htmlFor="name">Name</Label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} id="" className="form-input my-1" placeholder="Name" /> <br />
            <Label htmlFor="address">Address</Label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} id="" className="form-input my-1" placeholder="Address" /> <br />
            <div className="my-1 flex">
                <input type="radio" name="insideDhaka" id="" checked={insideDhaka} onChange={(e) => {
                    if (e.target.checked) {
                        setInsideDhaka(true)
                    }
                }} /> Inside Dhaka
                <div className="mx-2"></div>
                <input type="radio" name="insideDhaka" id="" checked={!insideDhaka} onChange={(e) => {
                    if (e.target.checked) {
                        setInsideDhaka(false)
                    }
                }} /> Outside Dhaka
            </div>
            <Label htmlFor="phone">Phone</Label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} id="" className="form-input my-1" placeholder="Phone" /> <br />
            <Label htmlFor="price">Sub Total <span className="mx-2"></span>[Total : {total}]</Label>
            <input type="number" value={subTotal} onChange={(e) => setSubTotal(parseInt(e.target.value))} id="" className="form-input my-1" placeholder="Price" /> <br />
            <Label htmlFor="quantity">Quantity</Label>
            <input type="number" name="quantity" id="" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value))} className="form-input" />
            <Label htmlFor="weight">Weight</Label>
            <input type="text" name="weight" value={weight} id="" onChange={(e) => setWeight(e.target.value)} className="form-input" />
            Select Courier : <select onChange={(e) => setCourier(e.target.value)} className="bg-white px-2 py-1 border rounded my-2" name="" id="">
                {courier === 'pathao' ? <option value="pathao" selected>Pathao</option> : <option value="pathao">Pathao</option>}
                {courier === 'steadfast' ? <option value="steadfast" selected>Steadfast</option> : <option value="steadfast">Steadfast</option>}
            </select>
            {courier === 'pathao' && <div className="flex flex-col">
                <div>
                    Select City : <select onChange={(e) => setCity(parseInt(e.target.value))} className="bg-white px-2 py-1 border rounded mx-2" name="" id="">
                        <option value="">City</option>
                        {pathao.cities.map((c) => {
                            if (c.id === city) {
                                return <option selected value={c.id}>{c.name}</option>
                            }
                            return <option value={c.id}>{c.name}</option>
                        })}
                    </select>
                </div>
                {city !== null && zones.length > 0 && <div className="my-2">
                    Select zone : <select onChange={(e) => setZone(parseInt(e.target.value))} className="bg-white px-2 py-1 border rounded mx-2" name="" id="">
                        <option value="">Zone</option>
                        {zones.map((z) => {
                            if (z.id === zone) {
                                return <option selected value={z.id}>{z.name}</option>
                            }
                            return <option value={z.id}>{z.name}</option>
                        })}
                    </select>
                </div>}
                {zone !== null && areas.length > 0 && <div className="my-2">
                    Select Area : <select onChange={(e) => setArea(parseInt(e.target.value))} className="bg-white px-2 py-1 border rounded mx-2" name="" id="">
                        <option value="">Area</option>
                        {areas.map((a) => {
                            if (a.id === area) {
                                return <option selected value={a.id}>{a.name}</option>
                            }
                            return <option value={a.id}>{a.name}</option>
                        })}
                    </select>
                </div>}
            </div>}
            <textarea name="" id="" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Notes" rows={5} className="form-input my-1"></textarea>
            {adding ? <Spinner /> : <button onClick={() => addOrder()} type="button" className="btn my-2">Confirm</button>}
        </div>
        <div className="w-1/2 p-3">
            <div className="my-1">
                <h3>
                    Selected Products
                </h3>
                {items?.map((prod) => {
                    return <div className="my-1 flex flex-row">
                        <Image width={200} height={200} src={prod.product.images[0].url} className="w-[100px] h-[100px] rounded me-3" alt="Image" />
                        <div>
                            <h3>
                                {prod.product.name}
                            </h3>
                            {prod.variant && <h3>
                                {prod.variant?.name}
                            </h3>}
                            {prod.color && <h3>
                                {prod.color?.name}
                            </h3>}
                            <h3>
                                X {prod.count}
                            </h3>
                            <button className="my-1 btn" onClick={() => removeItem(prod)}>Remove</button>
                        </div>
                    </div>
                })}
                <div className="my-1 p-3">
                    <b>Add</b>
                    {products.products.map((prod) => {
                        return <AddProduct key={prod.id} add={addItem} product={prod} />
                    })}
                </div>
            </div>
        </div>
    </form>
}   
