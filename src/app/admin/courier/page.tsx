import { prisma } from "@/prisma";

export default async function Page(){
    const orders = await prisma.order.findMany({
        where: {
            status: 'Complete'
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
        orderBy: {
            created_at: 'desc'
        }
    })
    return <div className="p-3">
        <h3 className="text-lg font-bold">Orders List</h3>
        
    </div>
}