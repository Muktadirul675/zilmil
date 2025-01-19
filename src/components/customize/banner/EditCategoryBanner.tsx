'use client';

import { editCategoryBanner } from "@/actions/customize";
import StateButton from "@/components/StateButton";
import { Category } from "@prisma/client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useFormState } from "react-dom";

function Input({ category, logoUrl, checked }: { checked: boolean,category: Category, logoUrl: string | null }) {
    const [logo, setLogo] = useState<File | null>(null)
    const preview = useMemo(() => {
        if (logo) {
            return URL.createObjectURL(logo)
        }
        return null;
    }, [logo])
    return <div className="p-3 rounded flex items-center my-1">
        {/* {`${category.id}-name`} */}
        <input defaultChecked={checked} type="checkbox" value={category.id} name="categories[]" id="" className="mx-1" /> 
        <input type="text" defaultValue={category.name} name={`${category.id}-name`} id="" className="form-input mx-1" />
        <div className="ms-auto flex items-center">
            {(logoUrl !== null && preview === null) && <Image src={logoUrl} alt="Logo" height={80} width={80} className="h-[80px] w-[80px]" />}
            {preview !== null && <Image src={preview} alt="Logo" height={80} width={80} className="h-[80px] w-[80px]" />}
            <div className="mx-2"></div>
            <input defaultChecked={checked} type="file" onChange={(e) => {
                if (e.target.files) {
                    setLogo(e.target.files[0] as File)
                }
            }} name={`${category.id}-logo`} accept="image/*" id="" />
        </div>
    </div>
}

export default function EditCategoryBanner({ categories }: { categories: { id: string, logo: string }[] }) {
    const [allCategories, setAllCategories] = useState<Category[]>([])
    useEffect(() => {
        async function fet() {
            const res = await fetch("/api/categories")
            const data: Category[] = await res.json()
            setAllCategories(data)
        }
        fet()
    }, [])

    const [state, action] = useFormState(editCategoryBanner, { message: '', error: '' })

    return <div>
        <h3 className="text-lg font-bold my-2">Select Categories</h3>
        <form action={action}>
            {state.message !== '' && <div className="p-3 my-1 rounded bg-green-300 border border-green-500 text-white">
                {state.message}
            </div>}
            {state.error !== '' && <div className="p-3 my-1 rounded bg-red-300 border border-red-500 text-white">
                {state.error}
            </div>}
            {allCategories.map((cat) => {
                const logo = categories.find((c) => c.id === cat.id)?.logo ?? null
                const checked  = categories.find((c)=>c.id === cat.id)
                return <Input checked={checked !== undefined} category={cat} logoUrl={logo} key={cat.id} />
            })}
            <StateButton>Save</StateButton>
        </form>
    </div>
}
