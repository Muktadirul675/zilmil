'use client';

import { BarContent } from "@/app/admin/customize/categorybar/page";
import { Category } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
import { BiChevronDown } from "react-icons/bi";

function Content({ cont }: { cont: BarContent }) {
    const [display, setDisplay] = useState<boolean>(false)
    if (cont.id !== '') {
        return <Link className="px-2 py-1.5 border-r-[0.5px] border-gray-200 border-opacity-70" href={`/categories/${cont.id}`}>{cont.name}</Link>
    } else {
        return <div className="px-2 py-1.5 border-r-[0.5px] border-gray-200 border-opacity-70 relative">
            <div className="rotate-180 hidden"></div>
            <h3 className="text-lg text-white flex items-center  cursor-pointer" onClick={()=>setDisplay(!display)}>
                {cont.name}
                <BiChevronDown className={`${display && 'rotate-180'}`}/>
            </h3>
            <div className="block md:hidden" hidden></div>
            {cont.subs.length > 0 && <div className={`absolute my-2 top-100 text-black border p-2 rounded bg-white animate-topDownSlide ${display ? 'block' : 'hidden'}`}>
                {cont.subs.map((s)=>{
                    return <h3>{s.name}</h3>
                })}
            </div>}
        </div>
    }
}

export default function CategoryBar({ selecteds, categories }: { selecteds: BarContent[], categories: Category[] }) {
    const [show, setShow] = useState<boolean>(false)
    function click() {
        setShow((prev) => !prev)
    }
    return <>
        <div className="hidden md:flex bg-base-theme border-b relative">
            <div className="w-2/3 mx-auto flex items-center flex-wrap text-white font-semibold relative">
                <div onClick={click} className="border-l-[0.5px] border-r-[0.5px] px-2 py-1.5 border-gray-200 border-opacity-70 cursor-pointer">
                    <div className="flex items-center">
                        All Categories <BiChevronDown className="text-lg ms-1 inline" />
                    </div>
                    <div className="hidden md:flex" hidden></div>
                    <div className={`my-2 ${show ? 'flex' : 'hidden'} flex-col animate-topDownSlide border bg-white transition-all rounded p-4 text-black absolute w-[800px] left-0 top-[100%] z-20 flex-wrap`}>
                        {categories.map((c) => {
                            return <div key={c.id} className="w-full my-1 font-bold">
                                {c.name}
                            </div>
                        })}
                    </div>
                </div>
                {selecteds.map((s) => {
                    return <Content key={s.id} cont={s}/>
                })}
            </div>
        </div>
    </>
}