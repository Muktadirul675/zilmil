import { auth } from "@/auth";
import { prisma } from "@/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AiFillProduct } from "react-icons/ai";
import { BiCarousel, BiCategory, BiHome } from "react-icons/bi";
import { FaUserGroup } from "react-icons/fa6";
import { GrOrderedList } from "react-icons/gr";
import { MdAnnouncement, MdOutlineWarehouse, MdPendingActions } from "react-icons/md";
import { TbCategory, TbHomeEdit } from "react-icons/tb";
import AdminRoutes from "../../components/AdminRoutes";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await auth()
    const user = await prisma.user.findUnique({
        where:{email:session?.user?.email ?? ''} 
    })
    if(!user || !user.is_admin){
        redirect("/unauthorized")
    }
    return <div className="flex">
        <div className="w-fit min-h-[calc(100vh-60px)] md:min-h-[calc(100vh-80px)] sticky top-[60px] md:top-[80px] p-1 md:p-3 flex flex-col bg-base-theme">
           <AdminRoutes/>
        </div>
        <div className="flex-grow p-3 flex justify-center">
            <div className="w-full">
                {children}
            </div>
        </div>
    </div>
}