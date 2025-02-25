'use client'

import { useProducts } from "@/stores/products"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"
import { BiSearch } from "react-icons/bi"
import { CgClose } from "react-icons/cg"

interface Product {
    name: string;
    id: string;
    stocks: number;
    price: number;
    discounted_price: number | null;
    slug: string,
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
}

export default function SearchButton() {
    const [query, setQuery] = useState<string>('')
    const [display, setDisplay] = useState<string>('hidden')
    const router = useRouter()

    const products = useProducts()
    const [filtered, setFiltered] = useState<Product[]>([])

    useEffect(() => {
        if (!query.trim()) {
            setFiltered([])
        } else {
            setFiltered(products.products.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase())))
        }
    }, [query])

    async function submit(e: FormEvent) {
        e.preventDefault()
        setDisplay('hidden')
        router.push(`/search?query=${query}`)
    }

    return <>
        <div className="block md:hidden">
            <div className="hidden md:flex" hidden></div>
            <BiSearch onClick={() => setDisplay((prev) => prev === 'hidden' ? 'flex' : 'hidden')} className="text-2xl font-bold cursor-pointer hover:text-base-theme" />
        </div>
        <form onSubmit={submit} className={`${display} flex-col items-center absolute top-full left-0 right-0 bg-white p-3`} id="topSearchForm">
            <div className="flex items-center">
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search Products" className="border-2 px-2 text-lg w-1/2 border-base-theme mx-0 h-[40px] focus:outline-none focus:border-base-theme flex-grow" type="text" name="" id="" required />
                <button className="bg-base-theme flex items-center justify-center text-white h-[40px] px-2 rounded-tr-sm rounded-br-sm">
                    Search
                </button>
                <CgClose onClick={() => setDisplay((prev) => prev === 'hidden' ? 'flex' : 'hidden')} className="mx-2 text-2xl" />
            </div>
            {filtered.length > 0 && <div className="rounded shadow absolute top-[100%] w-full flex flex-col border bg-white left-0">
                {filtered.map((product) => {
                    return <div onClick={() => {
                        router.push(`/products/${product.slug}`)
                        setQuery('')
                        setDisplay('hidden')
                    }} className="p-3 border flex hover:bg-slate-50 transition-all first:rounded-tr rounded-tl items-center">
                        <Image quality={100} src={product.images[0].url} alt={product.name} width={80} height={80} className="w-[80px] h-[80px] rounded me-3" />
                        <div className="font-bold">
                            <div>
                                {product.name}
                            </div>
                            {product.discounted_price !== null && <div className="flex items-center">
                                <p>{product.discounted_price}</p>
                                <p className="mx-3 line-through text-gray-500 text-sm">
                                    {product.price}
                                </p>
                            </div>}
                            {product.discounted_price === null && <div className="flex items-center">
                                {product.price}
                            </div>}
                        </div>
                    </div>
                })}
            </div>}
        </form>
    </>
}