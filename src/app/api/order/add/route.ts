import { prisma } from '@/prisma'
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

interface Variant {
    id: string,
    name: string,
    stocks: number
}

interface Color {
    id: string,
    name: string,
    stocks: number,
    hex: string
}

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
    variants: Variant[],
    colors: Color[],
}[]

export interface Item {
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
    items: Item[],
    order_price: number,
    note?: string | null,
    inside_dhaka: boolean,
    zone?: number | null,
    city?: number | null,
    area?: number | null,
    status: string
}

export async function POST(request: Request) {
    const data: Order = await request.json()
    const order = await prisma.order.create({
        data: {
            address: data.address,
            inside_dhaka: data.inside_dhaka,
            order_price: data.order_price,
            phone: data.phone,
            area: data.area,
            city: data.city,
            courier: data.courier,
            name: data.name,
            zone: data.zone,
            note: data.note,
            status: data.status,
            items: {
                create: data.items.map((it) => {
                    return {
                        productId: it.product.id,
                        colorId: it.color?.id,
                        variantId: it.variant?.id
                    }
                })
            }
        },
        include: {
            items: {
                include: {
                    product: {
                        select: {
                            id: true,
                            categories: true,
                            discounted_price: true,
                            name: true,
                            is_available: true,
                            price: true,
                            slug: true,
                            stocks: true,
                            images: {
                                take: 1
                            }
                        }
                    },
                    variant: true,
                    color: true
                }
            }
        },
    })

    revalidatePath("/admin/orders")
    return NextResponse.json(order)
}