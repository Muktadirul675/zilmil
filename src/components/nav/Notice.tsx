'use client'

import { usePathname } from "next/navigation"

export default function Notice({notice}:{notice: string}) {
    const path = usePathname()
    if(path.startsWith("/admin")){
        return null
    }
    return <div className="flex w-full p-2 text-white text-bold bg-base-theme">
        <div className="mx-auto w-full md:w-2/3 h-[20px] flex items-center text-sm">
            {notice}
        </div>
    </div>
}