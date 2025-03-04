'use client';

import { addProduct } from "@/actions/products";
import ErrorList from "@/components/ErrorList";
import Spinner from "@/components/Spinner";
import { useColors } from "@/hooks/colors";
import { useErrors } from "@/hooks/errors";
import { useImages } from "@/hooks/images";
import { useVariants } from "@/hooks/variants";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { BiBold, BiCloudUpload, BiTrash } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import { CiBoxList } from "react-icons/ci";
import { FaListOl } from "react-icons/fa";

function Label({ children, htmlFor }: { children: React.ReactNode, htmlFor: string }) {
    return <label htmlFor={htmlFor} className="text-lg font-bold">{children}</label>
}



export default function Page() {
    const colors = useColors()
    const variants = useVariants()
    const images = useImages()
    const errors = useErrors()

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
        ],
        content: '',
    })

    const [categories, setCategories] = useState<{ name: string, id: string }[]>([])

    const fetchCategories = useCallback(async () => {
        const res = await fetch("/api/categories", {
            cache: 'no-store'
        })
        const categories = await res.json()
        setCategories(categories)
    }, [])

    useEffect(() => {
        fetchCategories()
    }, [])

    const [name, setName] = useState<string | null>('')
    const [stocks, setStocks] = useState<number | null>(null)
    const [price, setPrice] = useState<number | null>(null)
    const [dprice, setDprice] = useState<number | null>(null)

    const [selectedCategories, setSelectedCategories] = useState<{ name: string, id: string }[]>([])

    const [adding, setAdding] = useState<boolean>(false)

    async function submit() {
        const description = editor?.getHTML()
        const descriptionText = editor?.getText()
        setAdding(true)
        let invalid = false;
        const formData = new FormData()

        if (!name || name === '') {
            invalid = true;
            errors.add("Name can't be empty")
        } else {
            const res1 = await fetch("/api/available/" + name.toString(), {
                cache: 'no-store'
            })
            const available: { available: boolean } = await res1.json()
            if (available.available) {
                formData.append('name', name)
            } else {
                errors.add("Product with name " + name.toString() + " already created")
                invalid = true;
            }
        }
        if ((!descriptionText || descriptionText === '') || !description) {
            invalid = true
            errors.add("Description can't be empty")
        } else {
            formData.append("description", description as string)
        }
        if (!stocks || stocks < 1) {
            invalid = true
            errors.add("Stocks should be be at least 1")
        } else {
            formData.append("stocks", `${stocks}`)
        }
        if (!price || price < 1) {
            invalid = true
            errors.add("Price should be be at least 1")
        } else {
            formData.append("price", `${price}`)
        }
        formData.append("dPrice", `${dprice}`)
        if (invalid) {
            setAdding(false)
            return
        }

        if (images.images.length) {
            for (const f of images.images) {
                formData.append("images[]", f.image)
                URL.revokeObjectURL(f.preview)
            }
        }

        if (variants.variants.length) {
            for (const v of variants.variants) {
                formData.append("variants[]", JSON.stringify({ name: v.name, stocks: v.stocks }))
            }
        }

        if (colors.colors.length) {
            for (const c of colors.colors) {
                formData.append("colors[]", JSON.stringify({ name: c.name, stocks: c.stocks, hex: c.hex }))
            }
        }

        if (selectedCategories.length) {
            formData.append("categories[]", JSON.stringify(selectedCategories))
        }

        const data = await addProduct(formData)
        console.log(data)
        setAdding(false)
    }

    return <>
        <h3 className="text-[30px] p-1">
            Add Product
        </h3>
        <div className="flex flex-col md:flex-row p-1">
            <div className="w-full md:w-1/2 p-3">
                <div className="mb-1 flex flex-col">
                    <Label htmlFor="name">Name</Label>
                    <input value={name ?? ''} onChange={(e) => setName(e.target.value)} type="text" name="name" id="name" className="form-input" />
                </div>
                <div className="mb-1 flex flex-col">
                    <Label htmlFor="description">Description</Label>
                    {editor ? <>
                        <div className="editor-controls flex justify-around rounded border transition-all">
                            <div onClick={() => editor?.chain().focus().toggleBold().run()} className={`flex-grow text-center cursor-pointer hover:bg-slate-100 p-1 text-md transition-all ${editor?.isActive('bold') ? 'active' : ''}`}>
                                <BiBold className="inline" />
                                +               </div>
                            <div onClick={() => editor?.chain().focus().toggleBulletList().run()} className={`flex-grow text-center cursor-pointer hover:bg-slate-100 p-1 text-md transition-all ${editor?.isActive('bulletList') ? 'active' : ''}`}>
                                <CiBoxList className="inline" />
                            </div>
                            <div onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={`flex-grow text-center cursor-pointer hover:bg-slate-100 p-1 text-md transition-all ${editor?.isActive('orderedlist') ? 'active' : ''}`}>
                                <FaListOl className="inline" />
                            </div>
                        </div>
                        <EditorContent rows={7} editor={editor} className="my-1" />
                    </> : <div className="flex justify-center p-3 items-center">
                        <Spinner />
                    </div>
                    }
                </div>
                <div className="mb-1 flex flex-col">
                    <Label htmlFor="stocks">Stocks</Label>
                    <input value={stocks ?? ''} onChange={(e) => setStocks(parseInt(e.target.value))} type="number" min={1} name="stocks" id="stocks" className="form-input" />
                </div>
                <div className="mb-1 flex flex-col">
                    <Label htmlFor="price">Price</Label>
                    <input value={price ?? ''} onChange={(e) => setPrice(parseInt(e.target.value))} type="number" min={1} name="price" id="price" className="form-input" />
                </div>
                <div className="mb-1 flex flex-col">
                    <Label htmlFor="d_price">Discounted Price</Label>
                    <input type="number" value={dprice ?? ''} onChange={(e) => setDprice(e.target.value === '' ? null : parseInt(e.target.value))} min={1} name="d_price" id="d_price" className="form-input" />
                </div>
                <div className="mb-1 flex flex-col">
                    {images.images && <div className="flex flex-col my-1">
                        {images.images.map((image) => <div key={image.key} className='my-1 relative'>
                            <img src={image.preview} alt="" />
                            <button onClick={() => images.remove(image.key)} className="absolute top-4 right-4 opacity-50 cursor-pointer hover:opacity-100 bg-red-500 p-1 text-white rounded">
                                <CgClose className="text-lg text-white" />
                            </button>
                        </div>)}
                    </div>}
                    <input onChange={async (e) => {
                        if (e.target.files) {
                            const files = Array.from(e.target.files)
                            for (const f of files) {
                                await images.add(f)
                            }
                        }
                    }} type="file" name="images" id="images" className="hidden" multiple />
                    <label htmlFor="images" className="flex w-full p-3 justify-center items-center border-2 border-dashed rounded bg-slate-100 cursor-pointer">
                        <BiCloudUpload className="text-xl text-blue-500" />
                        <div className="mx-1"></div>
                        <b>Add Image (Optional)</b>
                    </label>
                </div>
                <div className="my-1">
                    <h3 className="text-lg font-bold">Select Categories (Optional)</h3>
                    {/* {JSON.stringify(categories)} */}
                    <div className="border rounded">
                        {categories.map((cat) => {
                            const isSelected = selectedCategories.some((c) => c.id === cat.id)
                            return <div key={cat.id} onClick={() => {
                                if (isSelected) {
                                    setSelectedCategories((prev) => prev.filter((p) => p.id !== cat.id))
                                } else {
                                    setSelectedCategories((prev) => [...prev, cat])
                                }
                            }} className={`p-2 border-b cursor-pointer transition-all ${isSelected ? 'bg-blue-400 border-blue-600 border text-white' : 'bg-white border-b'}`}>
                                <div className="bg-blue-400 border border-blue-600 text-white" hidden></div>
                                {cat.name}
                            </div>
                        })}
                    </div>
                </div>
            </div>
            <div className="w-full md:w-1/2 p-3">
                <div className="mb-2 flex flex-col">
                    <label className="text-lg font-bold" htmlFor="variantName">Add Variant (Optional)</label>
                    {variants.variants && <div className="my-1">
                        {variants.variants.map((variant) => {
                            return <div key={variant.key} className="my-1 p-2 flex bg-slate-100">
                                <h3 className="">{variant.name}</h3>
                                <div className="ms-auto">{variant.stocks}</div>
                                <div className="ms-auto">
                                    <BiTrash onClick={() => variants.remove(variant.key)} className="text-lg text-red-500 cursor-pointer" />
                                </div>
                            </div>
                        })}
                    </div>}
                    <input value={variants.name ?? ''} onChange={(e) => variants.setName(e.target.value)} type="text" name="" id="" placeholder="Variant Name" className="form-input my-1" />
                    <input value={variants.stocks ?? ''} onChange={(e) => variants.setStocks(parseInt(e.target.value))} type="number" min={1} name="" id="" placeholder="Variant Stocks" className="form-input my-1" />
                    <div>
                        <ErrorList errorInstance={variants.errors} />
                        <button onClick={() => variants.add()} className="btn">Add Variant</button>
                    </div>
                </div>
                <div className="mb-2 flex flex-col">
                    <label className="text-lg font-bold" htmlFor="">Add Color (Optional)</label>
                    {colors.colors && <div className="my-1 flex flex-wrap">
                        {colors.colors.map((color) => {
                            return (
                                <div key={color.key} className="mx-1 flex flex-col justify-center">
                                    <div className="w-10 h-10 rounded-full" style={{ backgroundColor: `${color.hex}` }}></div>
                                    <div className="text-sm flex items-center w-fit">
                                        {color.name} ({color.stocks})
                                        <div className="ms-auto inline-block">
                                            <CgClose onClick={() => colors.remove(color.key)} className="text-lg cursor-pointer" />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>}
                    <div className="my-2 flex items-center">
                        <div onClick={()=>{
                            colors.setHex("#000000")
                            colors.setName("Black")
                        }} className="w-10 h-10 rounded-full border bg-black me-2"></div>
                        <div onClick={()=>{
                            colors.setHex("#ffffff")
                            colors.setName("White")
                        }}  className="w-10 h-10 rounded-full border bg-white me-2"></div>
                        <div onClick={()=>{
                            colors.setHex("#EF4444")
                            colors.setName("Red")
                        }}  className="w-10 h-10 rounded-full border bg-red-500 me-2"></div>
                        <div onClick={()=>{
                            colors.setHex("#22C55E")
                            colors.setName("Green")
                        }}  className="w-10 h-10 rounded-full border bg-green-500 me-2"></div>
                        <div onClick={()=>{
                            colors.setHex("#3B82F6")
                            colors.setName("Blue")
                        }}  className="w-10 h-10 rounded-full border bg-blue-500 me-2"></div>
                        <div onClick={()=>{
                            colors.setHex("#EAB308")
                            colors.setName("Yellow")
                        }}  className="w-10 h-10 rounded-full border bg-yellow-500 me-2"></div>
                        <div onClick={()=>{
                            colors.setHex("#10B981")
                            colors.setName("Olive")
                        }}  className="w-10 h-10 rounded-full border bg-emerald-500 me-2"></div>
                    </div>
                    <input value={colors.name ?? ''} onChange={(e) => colors.setName(e.target.value)} type="text" name="" id="" placeholder="Color Name" className="form-input my-1" />
                    <input value={colors.stocks ?? ''} onChange={(e) => colors.setStocks(parseInt(e.target.value))} type="number" min={1} name="" id="" placeholder="Color Stocks" className="form-input my-1" />
                    <HexColorPicker className="my-1 w-full" color={colors.hex ?? ''} onChange={colors.setHex} />
                    <input value={colors.hex ?? ''} onChange={(e) => colors.setHex(e.target.value)} type="text" name="" placeholder="Hex" id="" className="form-input my-1" />
                    <div>
                        <ErrorList errorInstance={colors.errors} />
                        <button onClick={() => colors.add()} className="btn">Add Color</button>
                    </div>
                </div>
            </div>
        </div>
        <div className="my-1">
            <ErrorList errorInstance={errors} />
            {adding ? <Spinner /> : <button className="btn" onClick={submit}>Submit</button>}
        </div>
    </>
}