'use client';

import { BarContent } from "@/app/admin/customize/categorybar/page";
import { Category } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiChevronDown, BiChevronRight } from "react-icons/bi";
import { Content } from "./Navbar";


export default function CategoryBar({ selecteds, categories }: { selecteds: BarContent[], categories: Content[] }) {
    const [show, setShow] = useState<boolean>(false)
    function click() {
        setShow((prev) => !prev)
    }
    const [activeSub, setActiveSub] = useState<number | null>(null)
    useEffect(()=>{
        if(!show){
            setActiveSub(null)
        }
    },[show])
    return <>
        <div className="hidden md:flex bg-base-theme border-b relative">
            <div className="w-2/3 mx-auto flex items-center flex-wrap text-white font-semibold relative">
                <div className="border-l-[0.5px] border-r-[0.5px]  border-gray-200 border-opacity-70 cursor-pointer">
                    <div onClick={click} className="flex items-center px-2 py-1.5">
                        All Categories <BiChevronDown className="text-lg ms-1 inline" />
                    </div>
                    <div className="hidden md:flex" hidden></div>
                    {show && <div onMouseLeave={() => {
                        setShow(false)
                    }} className={`my-2 flex w-[620px] animate-topDownSlide transition-all rounded text-black absolute left-0 top-[100%] z-20 `}>
                        <div className="">
                            <div className="bg-white min-w-[200px] flex-grow border rounded flex flex-col">
                                {categories.map((c, index) => {
                                    if(c.id !== null){
                                        return <Link key={index} href={`/categories/${c.id}`} className="text-lg h-[52px] flex justify-start items-center px-3 border-b">
                                            {c.name}
                                        </Link>
                                    }
                                    return <div key={index} onMouseEnter={() => setActiveSub(index)} className=" text-lg h-[52px] flex justify-start items-center px-3 border-b">
                                        {c.name}
                                    </div>
                                })}
                            </div>
                        </div>
                        <div className="mx-2"></div>
                        <div className="flex-grow min-w-[200px] h-fit">
                            {categories.map((c, index) => {
                                return <div key={index} style={{ top: `${52 * index}px` }} className={`bg-white border rounded ${activeSub !== index && 'hidden'}`}>
                                    {c.subs?.map((s)=>{
                                        return <Link key={s.id} href={`/categories/${s.id}`} className="p-3 border-b last:border-b-0">
                                            {s.name}
                                        </Link>
                                    })}
                                </div>
                            })}
                        </div>
                    </div>}
                </div>
                {selecteds.map((s) => {
                    return <Link key={s.id} className="px-2 py-1.5 border-r-[0.5px] hover:bg-white hover:text-base-theme transition-all border-gray-200 border-opacity-70" href={`/categories/${s.id}`}>{s.name}</Link>
                })}
            </div>
        </div>
    </>
}