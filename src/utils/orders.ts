import { prisma } from "@/prisma";

export async function checkProductAvailability(ids: string[]){
    for(const id of ids){
        const product = await prisma.product.findUnique({
            where:{id:id} 
        })
        if(product){
            if(product.stocks <= 0){
                await prisma.product.update({
                    where:{id:id},
                    data:{
                        is_available: false,
                    }
                })
            }else{
                await prisma.product.update({
                    where:{id:id},
                    data:{
                        is_available: true,
                    }
                })
            }
        }
    }
}