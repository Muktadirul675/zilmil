'use client';

import { BarContent } from "@/app/admin/customize/categorybar/page";
import { Category } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import { GiHamburgerMenu } from "react-icons/gi";
import { Content } from "./Navbar";

function ShowSelected({ selected, setParentDisplay }: { selected: Content, setParentDisplay : Dispatch<SetStateAction<string>>}) {
    const [display, setDisplay] = useState<boolean>(false)
    if (selected.id === '') {
        return <>
            <div className="hidden rotate-180"></div>
            <h3 className="text-lg font-bold flex items-center w-full">
                {selected.name}
                {selected.subs?.length && selected.subs?.length > 0 && <BiChevronDown className={`ms-auto ${display ? 'rotate-180' : null} transition-all`} onClick={() => setDisplay(!display)} />}
            </h3>
            <div className="h-fit hidden"></div>
            {selected.subs?.length && selected.subs?.length > 0 && <div className={`ps-3 h-0 overflow-hidden transition-all`} style={{height: (display ? `${selected.subs.length * 20 + 10}px` : '0px')}}>
                {selected.subs.map((s) => <ShowSelected key={s.id} setParentDisplay={setParentDisplay}  selected={s} />)}
            </div>}
        </>
    } else {
        return <>
            <h3 className="text-lg font-bold flex items-center w-full">
                <Link onClick={()=>setParentDisplay('hidden')} href={`/categories/${selected.id}`}>
                    {selected.name}
                </Link>
                {selected.subs?.length && selected.subs?.length > 0 && <BiChevronDown className={`ms-auto ${display ? 'rotate-180' : null} transition-all`} onClick={() => setDisplay(!display)} />}
            </h3>
            <div className="h-fit hidden"></div>
            {selected.subs?.length && selected.subs?.length > 0 && <div className={`ps-3 h-0 overflow-hidden transition-all`} style={{height: (display ? `${selected.subs.length * 20 + 10}px` : '0px')}}>
                {selected.subs?.map((s) => <ShowSelected key={s.id} setParentDisplay={setParentDisplay} selected={s} />)}
            </div>}
        </>
    }
}

export default function Sidebar({ selecteds }: { selecteds: Content[] }) {
    const [display, setDisplay] = useState<string>('hidden')
    const router = useRouter()
    function toggle() {
        setDisplay((prev) => prev === 'hidden' ? 'block' : 'hidden')
    }
    return <>
        <div className="block md:hidden">
            <GiHamburgerMenu onClick={toggle} className="text-2xl me-2 cursor-pointer hover:text-base-theme" />
        </div>
        <div id="sidebar" className={`${display} fixed w-full top-0 left-0 bottom-0 z-25 bg-slate-50 p-3`}>
            <div className="flex w-[285px] border-b justify-center p-2 flex-col">
                <Image src="/logo.png" height={120} width={120} className="w-1/2" alt="Zilmil" />
                <h3 className="text-lg font-extrabold">zilmil.com.bd</h3>
            </div>
            <div className="hidden">
                {selecteds.map((s) => JSON.stringify(s))}
            </div>
            <CgClose onClick={toggle} className="text-2xl cursor-pointer hover:text-base-theme absolute top-4 right-4" />
            {selecteds.map((s) => {
                return <div className="my-1">
                    <ShowSelected key={s.id} setParentDisplay={setDisplay} selected={s} />
                </div>
            })}
        </div>
    </>
}