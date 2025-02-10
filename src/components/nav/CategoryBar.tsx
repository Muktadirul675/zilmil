'use client';

import { BarContent } from "@/app/admin/customize/categorybar/page";
import { Category } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
import { BiChevronDown, BiChevronRight } from "react-icons/bi";
import { Content } from "./Navbar";

function ShowContent({ cont }: { cont: Content }) {
    const [display, setDisplay] = useState<boolean>(false)
    if (cont.subs?.length && cont.subs?.length > 0) {
        return <div onClick={()=>setDisplay((prev)=>!prev)} onMouseEnter={() => setDisplay(true)} onMouseLeave={() => setDisplay(false)} className="p-3 border-b cursor-pointer">
            <b>{cont.name}</b>
            <div className="ms-auto"></div>
            <BiChevronRight />
            {display && <div onMouseEnter={() => setDisplay(true)} onMouseLeave={() => setDisplay(false)} className="absolute px-2 top-0 right-0">
                <div className="flex flex-col bg-white border">
                    {cont.subs.map((sub) => {
                        return <Link href={`/categories/${sub.id}`} className="p-3 flex items-center border-b cursor-pointer">
                            <b>{sub.name}</b>
                        </Link>
                    })}
                </div>
            </div>}
        </div>
    } else {
        return <Link href={`/categories/${cont.id}`} className="p-3 flex items-center border-b cursor-pointer">
            <b>{cont.name}</b>
        </Link>
    }
}

export default function CategoryBar({ selecteds, categories }: { selecteds: BarContent[], categories: Content[] }) {
    const [show, setShow] = useState<boolean>(false)
    function click() {
        setShow((prev) => !prev)
    }
    return <>
        <div className="hidden md:flex bg-base-theme border-b relative">
            <div className="w-2/3 mx-auto flex items-center flex-wrap text-white font-semibold relative">
                <div className="border-l-[0.5px] border-r-[0.5px]  border-gray-200 border-opacity-70 cursor-pointer">
                    <div onClick={click} className="flex items-center">
                        All Categories <BiChevronDown className="text-lg ms-1 inline" />
                    </div>
                    <div className="hidden md:flex" hidden></div>
                    {show && <div onMouseLeave={() => {
                        setShow(false)
                    }} className={`my-2  min-w-[300px] flex flex-col animate-topDownSlide border bg-white transition-all rounded text-black absolute overflow-visible left-0 top-[100%] z-20 `}>
                        {categories.map((c) => {
                            return <ShowContent cont={c} />
                        })}
                    </div>}
                </div>
                {selecteds.map((s) => {
                    return <Link key={s.id} className="px-2 py-1.5 border-r-[0.5px] hover:bg-white hover:text-base-theme transition-all border-gray-200 border-opacity-70" href={`/categories/${s.id}`}>{s.name}</Link>
                })}
            </div>
        </div>
    </>
}