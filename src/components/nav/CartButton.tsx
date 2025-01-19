'use client';

import { useCart } from "@/stores/cart";
import Link from "next/link";
import { BsBag } from "react-icons/bs";

export default function CartButton(){
    const cart = useCart()
    return <Link href="/cart" className="flex items-center cursor-pointer hover:text-base-theme transition-all">
        <BsBag className="text-2xl font-bold"/>
        <div className="mx-1"></div>
        <div className="text-lg font-bold">{cart.cart.length}</div>
    </Link>
}