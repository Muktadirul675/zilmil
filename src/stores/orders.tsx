'use client';

import { Order } from '@/components/orders/OrderManagement';
import { ORDER_STATUS } from '@/types';
import { Order as POrder } from '@prisma/client';
// context/CartContext.tsx
import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// Define the Cart context value type
interface CartContextType {
    orders: Order[],
    pending: Order[],
    fetchOrders:()=>Promise<void>;
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
    const [orders, setOrders] = useState<Order[]>([])
    const [isLoading] = useState<boolean>(false)
    const [fetching, setFetching] = useState<boolean>(false)

    const fetchOrders = useCallback(async () => {
        setFetching(true)
        const res = await fetch("/api/order")
        const data: Order[] = await res.json()
        setOrders(data)
        setFetching(false)
    }, [])

    useEffect(()=>{
        fetchOrders()
    },[])

    const pending = useMemo(()=>{
        return orders.filter((ord)=>ord.status === 'pending')
    },[orders])

    return <OrderContext.Provider value={{ orders, pending, fetchOrders }}>
        {children}
    </OrderContext.Provider>
};


