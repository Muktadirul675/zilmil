import Orders from "@/components/orders/Orders";

export const revalidate = 3600;

export default async function Page(){
    return <Orders/>
}