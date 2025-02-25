'use client';

import { useProducts } from "@/stores/products";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

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

export default function SearchForm({ forceFull = false }: { forceFull?: boolean }) {
    const [query, setQuery] = useState<string>('')
    const router = useRouter()

    async function submit(e: FormEvent) {
        e.preventDefault()
        router.push(`/search?query=${query}`)
    }

    const products = useProducts()
    const [filtered, setFiltered] = useState<Product[]>([])
    useEffect(() => {
        if (!query.trim()) {
            setFiltered([])
        } else {
            setFiltered(products.products.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase())))
        }
    }, [query])

    return <form onSubmit={submit} className={`w-full ${forceFull ? 'md:w-full' : 'md:w-1/2'} flex relative items-center`}>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search Products" className="px-2 border-2 text-lg flex-grow border-base-theme mx-0 h-[40px] focus:outline-none focus:border-base-theme" type="text" name="" id="" required />
        <button className="bg-base-theme text-white h-[40px] px-2 rounded-tr-sm rounded-br-sm">
            Search
        </button>
        {filtered.length > 0 && <div className="rounded shadow absolute top-[100%] mt-2 w-full flex flex-col border bg-white left-0">
            {filtered.map((product) => {
                return <div onClick={()=>{
                    router.push(`/products/${product.slug}`)
                    setQuery('')
                }} className="p-3 border cursor-pointer flex hover:bg-slate-50 transition-all first:rounded-tr rounded-tl items-center">
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
}