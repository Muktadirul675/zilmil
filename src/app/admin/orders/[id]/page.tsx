import OrderDetailsForm from '@/components/orders/OrderDetailsForm';
import { prisma } from '@/prisma';

export const revalidate = 1800;

export default async function Page({ params }: { params: { id: string } }) {
    const order = await prisma.order.findUnique({
        where: { id: params.id },
        include: {
            items: {
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            stocks: true,
                            discounted_price: true,
                            price: true,
                            images: {
                                take: 1
                            },
                            variants: true,
                            colors: true
                        },
                    },
                    variant: true,
                    color: true
                }
            }
        }
    })
    if (!order) {
        return <h3>Order not found</h3>
    }
    return <div className="w-full mx-auto p-3">
        <h3 className="text-2xl">Order details</h3>
        <span className="px-2 py-1 my-1 font-bold rounded bg-slate-50">{order.id}</span> <br />
        <OrderDetailsForm order={order} />
    </div>
}

