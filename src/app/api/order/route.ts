import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { OrderPayload } from "@/types";
import { Order } from "@prisma/client";
import { NextResponse } from "next/server";
export const dynamic = 'force-dynamic'
export async function GET() {
    const orders: Order[] = await prisma.order.findMany({
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
    return NextResponse.json(orders)
}

export async function POST(request: Request) {
    const payload: OrderPayload = await request.json()
    console.log(payload)
    const secret = process.env.ZILMIL_SECRET
    if (secret !== payload.secret) {
        throw new Error("Unauthorized")
    }
    const session = await auth()
    if (session) {
        const user = await prisma.user.findUnique({
            where: { email: session.user?.email as string }
        })
        const order = await prisma.order.create({
            data: {
                name: payload.name,
                address: payload.address,
                phone: payload.phone,
                inside_dhaka: payload.inside_dhaka,
                order_price: payload.order_price,
                userId: user?.id,
            }
        })
        for (const i of payload.items) {
            await prisma.orderItem.create({
                data: {
                    orderId: order.id,
                    productId: i.product,
                    variantId: i.variant,
                    colorId: i.color
                }
            })
            console.log("created")
        }
        await prisma.cartItem.deleteMany({
            where: { userId: user?.id }
        })
        return NextResponse.json(order)
    } else {
        const order = await prisma.order.create({
            data: {
                name: payload.name,
                address: payload.address,
                phone: payload.phone,
                inside_dhaka: payload.inside_dhaka,
                order_price: payload.order_price,
                items: {
                    createMany: {
                        data: payload.items.map((i) => { return { productId: i.product } })
                    }
                }
            }
        })
        for (const i of payload.items) {
            await prisma.orderItem.create({
                data: {
                    orderId: order.id,
                    productId: i.product,
                    variantId: i.variant,
                    colorId: i.color
                }
            })
            console.log("created")
        }
        return NextResponse.json(order)
    }
}