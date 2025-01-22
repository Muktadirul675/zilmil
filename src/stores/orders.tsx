'use client';

import { Order } from '@/components/orders/Orders';
import { ORDER_STATUS } from '@/types';
import { Order as POrder } from '@prisma/client';
// context/CartContext.tsx
import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// Define the Cart context value type
interface CartContextType {
    orders: { page: number, orders: Order[] }[],
    counts: {
        count: number,
        pending: number,
        delivered: number,
        returned: number,
        confirmed: number,
        dismissed:number
    },
    getPage : (page: number) => Promise<Order[]>
}

// Create the Cart Context with a default value
const OrderContext = createContext<CartContextType | undefined>(undefined);

// Custom hook to use the Cart context
export const useOrders = (): CartContextType => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

// CartProvider component that wraps around your application
interface OrderProviderProp {
    children: ReactNode;
}

export const OrderProvider = ({ children }: OrderProviderProp) => {
    const [orders, setOrders] = useState<{ page: number, orders: Order[] }[]>([])
    const [counts, setCounts] = useState<{
        count: number,
        pending: number,
        delivered: number,
        returned: number,
        confirmed: number,
        dismissed : number
    }>({
        count: 0,
        pending: 0,
        delivered: 0,
        returned: 0,
        confirmed: 0,
        dismissed: 0
    })
    const [isLoading] = useState<boolean>(false)
    const [fetching, setFetching] = useState<boolean>(false)

    async function getCount() {
        const res = await fetch("/api/order/count")
        const json: {
            count: number,
            pending: number,
            delivered: number,
            returned: number,
            confirmed: number,
            dismissed:number
        } = await res.json()
        setCounts(json)
    }

    async function getPage(page: number){
        for(const o of orders){
            if(o.page === page){
                return o.orders
            }
        }
        const res = await fetch("/api/order?page="+page)
        const data: Order[] = await res.json()
        setOrders((prev)=>[...prev,{page:page, orders: data}])
        return data;
    }

    useEffect(() => {
        getCount()
        getPage(1)
    }, [])

    return <OrderContext.Provider value={{ orders, counts, getPage }}>
        {children}
    </OrderContext.Provider>
};


