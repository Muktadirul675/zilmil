import Breadcrumb from "@/components/Breadcrumb";
import Cart from "@/components/cart/Cart";

export const dynamic = 'force-dynamic';

export default async function Page(){
    // const session = await auth()
    // const user = await prisma.user.findUnique({
    //     where:{
    //         email: session?.user?.email ?? ''
    //     }
    // })

    return <>
        <Breadcrumb links={[{ name: 'Home', url: '/' },{ name: 'Cart', url: '/cart' }]}/>
        <Cart/>
    </> 
}