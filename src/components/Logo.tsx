'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Logo() {
    const path = usePathname()
    if (path.startsWith("/admin")) {
        return <Link href='/admin' className="w-fit md:w-1/3">
            <Image src="/logo.png" width={100} height={40} alt="Zilmil" className="h-10" />
        </Link>
    }
    return <Link href='/' className="w-fit md:w-1/3">
        <Image src="/logo.png" width={100} height={40} alt="Zilmil" className="h-10" />
    </Link>
}
