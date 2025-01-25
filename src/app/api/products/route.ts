import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export async function GET(){
    const products = await prisma.product.findMany({
        where: {is_available:true},
        select:{
            id: true,
            name: true,
            price: true,
            discounted_price: true,
            images: {
                take:1,
            },
            stocks: true,
            variants: true,
            colors: true
        }
    })
    return NextResponse.json(products)
}