import Image from "next/image";
import Notice from "./Notice";
import Link from "next/link";
import SearchForm from "./SearchForm";
import Hotline from "./Hotline";
import CartButton from "./CartButton";
import AuthButton from "./AuthButton";
import SearchButton from "./SearchButton";
import Sidebar from "./Sidebar";
import fs from 'fs'
import path from "path";
import { prisma } from "@/prisma";
import CategoryBar from "./CategoryBar";
import { BarContent } from "@/app/admin/customize/categorybar/page";
import Logo from "../Logo";

export interface Content {
    uid: number,
    name?: string,
    id?: string,
    subs?: { uid: number, id?: string, name?: string }[]
}

export default async function Navbar() {
    const selectedCategories : BarContent[] = JSON.parse(fs.readFileSync(`${path.join(process.cwd(),'src','categories.json')}`,'utf-8'))
    const categories : Content[] = JSON.parse(fs.readFileSync(`${path.join(process.cwd(),'src','all_categories.json')}`,'utf-8'));
    const homejsonpath = path.join(process.cwd(), 'src', 'home.json')
    const homejsonfile = fs.readFileSync(homejsonpath, 'utf-8')
    const json = JSON.parse(homejsonfile)
    return <>
        <Notice notice={json.notice}/>
        <div className="flex bg-white w-full p-2 h-[60px] md:h-[80px] sticky top-0 left-0 border-b-2 border-base-theme z-20">
            <div className="flex w-full md:w-2/3 mx-auto items-center">
                <Sidebar selecteds={categories}/>
                <Logo/>
                <div className="hidden md:flex justify-center w-1/3 flex-grow items-center flex-row mx-auto relative">
                    <SearchForm forceFull={true}/>
                </div>
                <div className="flex items-center ms-auto justify-end w-fit md:w-1/3">
                    <Hotline />
                    <SearchButton/>
                    <div className="mx-3"></div>
                    <CartButton />
                    <div className="mx-3"></div>
                    <AuthButton/>
                </div>
            </div>
        </div>
        <CategoryBar selecteds={selectedCategories} categories={categories}/>
    </>
}