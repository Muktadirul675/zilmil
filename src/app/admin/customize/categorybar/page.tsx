export const dynamic = 'force-dynamic';
import CustomizeCategorybar from '@/components/customize/categoriesbar/page';
import { prisma } from '@/prisma';
import fs from 'fs';
import path from 'path';

export interface BarContent{
    id?: string,
    name?: string,
    subs : BarContent[]
}

export default async function Page() {
    const categoriesJson = path.join(process.cwd(), 'src', 'categories.json')
    const categoriesJsonPath = fs.readFileSync(categoriesJson, 'utf-8')
    const selecteds: BarContent[] = JSON.parse(categoriesJsonPath)
    const categories = await prisma.category.findMany({})
    return <div className='p-1'>
        <CustomizeCategorybar selecteds={selecteds} categories={categories}/>
    </div>
}