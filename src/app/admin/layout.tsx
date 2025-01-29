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
            <Link href="/admin" className="flex transition-all my-3 items-center  text-white p-3 rounded hover:bg-base-theme-dark">
                <BiHome className="text-xl" />
                <span className="hidden md:flex">
                    <span className="mx-2"></span>
                    Home
                </span>
            </Link>
            <Link href="/admin/users" className="flex transition-all my-3 items-center  text-white p-3 rounded hover:bg-base-theme-dark">
                <FaUserGroup className="text-xl" />
                <span className="hidden md:flex">
                    <span className="mx-2"></span>
                    Users
                </span>
            </Link>
            <Link href="/admin/products" className="flex transition-all my-3 items-center  text-white p-3 rounded hover:bg-base-theme-dark">
                <AiFillProduct className="text-xl" />
                <span className="hidden md:flex">
                    <span className="mx-2"></span>
                    Products
                </span>
            </Link>
            <Link href="/admin/stocks" className="flex transition-all my-3 items-center  text-white p-3 rounded hover:bg-base-theme-dark">
                <MdOutlineWarehouse className="text-xl" />
                <span className="hidden md:flex">
                    <span className="mx-2"></span>
                    Add Stocks
                </span>
            </Link>
            <Link href="/admin/categories" className="flex transition-all my-3 items-center  text-white p-3 rounded hover:bg-base-theme-dark">
                <BiCategory className="text-xl" />
                <span className="hidden md:flex">
                    <span className="mx-2"></span>
                    Categories
                </span>
            </Link>
            <div className="hidden md:flex transition-all mt-2 mb-1.5 items-center uppercase text-white p-3 rounded ">
                <span className="">
                    Order Management
                </span>
            </div>
            <Link href="/admin/orders" className="flex transition-all my-3 items-center  text-white p-3 rounded hover:bg-base-theme-dark">
                <GrOrderedList className="text-xl" />
                <span className="hidden md:flex">
                    <span className="mx-2"></span>
                    Orders
                </span>
            </Link>
            <Link href="/admin/courier" className="flex transition-all my-3 items-center  text-white p-3 rounded hover:bg-base-theme-dark">
                <GrOrderedList className="text-xl" />
                <span className="hidden md:flex">
                    <span className="mx-2"></span>
                    Courier
                </span>
            </Link>
            {/* <Link href="/admin/orders/pending" className="flex transition-all my-3 items-center  text-white p-3 rounded hover:bg-base-theme-dark">
                <MdPendingActions className="text-xl" />
                <span className="hidden md:flex">
                    <span className="mx-2"></span>
                    Pending Orders
                </span>
            </Link> */}
            <div className="hidden md:flex transition-all mt-3 mb-0 items-center uppercase text-white p-3 rounded ">
                <span className="">
                    Customization
                </span>
            </div>
            <Link href="/admin/customize/homepage" className="flex transition-all my-3 items-center  text-white p-3 rounded hover:bg-base-theme-dark">
                <TbHomeEdit className="text-xl" />
                <span className="hidden md:flex">
                    <span className="mx-2"></span>
                    Homepage
                </span>
            </Link>
            <Link href="/admin/customize/notice" className="flex transition-all my-3 items-center  text-white p-3 rounded hover:bg-base-theme-dark">
                <MdAnnouncement className="text-xl" />
                <span className="hidden md:flex">
                    <span className="mx-2"></span>
                    Notice
                </span>
            </Link>
            <Link href="/admin/customize/banner" className="flex transition-all my-3 items-center  text-white p-3 rounded hover:bg-base-theme-dark">
                <BiCarousel className="text-xl" />
                <span className="hidden md:flex">
                    <span className="mx-2"></span>
                    Banner
                </span>
            </Link>
            <Link href="/admin/customize/categorybar" className="flex transition-all my-3 items-center  text-white p-3 rounded hover:bg-base-theme-dark">
                <TbCategory className="text-xl" />
                <span className="hidden md:flex">
                    <span className="mx-2"></span>
                    Categories 
                </span>
            </Link>
            <Link href="/admin/customize/categorybanner" className="flex transition-all my-3 items-center  text-white p-3 rounded hover:bg-base-theme-dark">
                <BiCategory className="text-xl" />
                <span className="hidden md:flex">
                    <span className="mx-2"></span>
                    Categories Slider
                </span>
            </Link>
        </div>
        <div className="flex-grow p-1 flex justify-center">
            <div className="w-full md:w-1/2">
                {children}
            </div>
        </div>
    </div>
}