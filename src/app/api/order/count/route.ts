import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export const revalidate = 120

export async function GET(){
    const count = await prisma.order.count()
    const pending = await prisma.order.count({where:{
        status: 'pending'
    }})
    const delivered = await prisma.order.count({where:{
        status: 'delivered'
    }})
    const returned = await prisma.order.count({where:{
        status: 'returned'
    }})
    const confirmed = await prisma.order.count({where:{
        status: 'confirmed'
    }})
    const dismissed = await prisma.order.count({where:{
        status: 'dismissed'
    }})
    return NextResponse.json({
        count : count,
        pending: pending,
        delivered: delivered,
        returned : returned,
        confirmed: confirmed,
        dismissed:dismissed
    })
}