'use client';

import { editCategoryBar } from "@/actions/customize";
import { BarContent } from "@/app/admin/customize/categorybar/page";
import Spinner from "@/components/Spinner";
import { Category } from "@prisma/client";
import { useEffect, useState } from "react";
import { BiTrash } from "react-icons/bi";

interface OrderedBarContent extends BarContent{
    uid : number,
    subs : OrderedBarContent[]
}

function ShowBarContent({contents, categories, del}:{contents: OrderedBarContent[], categories: Category[], del : (selecteds: OrderedBarContent[], uid: number)=>void}){
    return contents.map((content)=><div className="font-bold p-2">
        {content.name} {content.id === null ? null : <div className="flex items-center">
            {categories.find((cat)=>cat.id === content.id)?.name} 
            {/* <div className="mx-2"></div> <BiTrash onClick={()=>del(contents, content.uid)} className="inline text-xl text-red-500"/> */}
        </div>}
        <div className="ps-3">
            <ShowBarContent del={del} contents={content.subs} categories={categories}/>
        </div>
    </div>)
}

let uid = 0;

export default function CustomizeCategorybar({selecteds, categories}:{selecteds: BarContent[], categories: Category[]}){
    const [json, setJson] = useState<OrderedBarContent[]>([])
    const [name, setName] = useState<string>('')
    const [linked, setLinked] = useState<string>('')
    const [subs, setSubs] = useState<OrderedBarContent[]>([])

    // useEffect(()=>{
    //     function selToOsel(selecteds: BarContent[]) : OrderedBarContent[]{
    //         const returns : OrderedBarContent[] = []
    //         for(const c of selecteds){
    //             returns.push({...c, uid:uid++, subs: selToOsel(c.subs)})
    //         }
    //         return returns
    //     }
    //     const oSelected : OrderedBarContent[] = selToOsel(selecteds)
    //     setJson(oSelected)
    // },[selecteds])

    function del(selecteds: OrderedBarContent[], uid: number){
        const s = {...selecteds}
        for(const i in s){
            if(s[i].uid === uid){
                delete s[i];
                break;
            }
            if(s[i].subs.length){
                for(const j in s[i].subs){
                    if(s[i].subs[j].uid == uid){
                        delete s[i].subs[j]
                    }
                }
            }
        }
        setJson(s ?? [])
    }

    function add(){
        if(!name){
            subs.forEach((su)=>{
                setJson((prev)=>[...prev, su])
            })
        }else{
            setJson((prev)=>[...prev, {id: linked, name:name, subs:subs, uid: uid++}])
        }
        setName('')
        setLinked('')
        setSubs([])
    }

    const [saving, setSaving] = useState<boolean>(false)

    async function save(){
        setSaving(true)
        const formData = new FormData()
        formData.append('categories',JSON.stringify(json))
        await editCategoryBar(formData)
        setSaving(false)
    }

    return <>
        <ShowBarContent del={del} contents={json} categories={categories}/>
        <hr />
        <input type="text" placeholder="Name" value={name} onChange={(e)=>setName(e.target.value)} className="form-input" />
        {categories.map((cat)=>{
            return <div className="flex items-center my-1"> <input className="block" type="checkbox" name="" checked={subs.some((s)=>s.id === cat.id)} onChange={(e)=>{
                if(e.target.checked){
                    setSubs((prev)=>[...prev, {id: cat.id, name: cat.name, subs:[], uid:uid++}])
                }else{
                    setSubs((prev)=>prev.filter((p)=>p.id !== cat.id))
                }
            }} id="" /> <div className="mx-1"></div> {cat.name} </div>
        })}
        <div className="my-1">
            <button onClick={add} className="btn">Add</button>
        </div>
        <div className="my-1">
            {saving ? <Spinner/> : <button onClick={save} className="btn">Save</button>}
        </div>
    </>
}