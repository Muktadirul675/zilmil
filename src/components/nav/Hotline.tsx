import Image from "next/image";
import { BiHeadphone } from "react-icons/bi";

export default function Hotline() {
    return <div className="hidden md:flex items-center flex-row">
        <div>
            <Image alt="Hotline" src="/hotline.png" height={40} width={40} className="h-[40px]"/>
        </div>
        <div className="mx-1"></div>
        <div>
            <h3 className="text-base-theme text-lg font-bold">
                01301871077
            </h3>
            <h3 className="font-bold text-sm">Hotline Number</h3>
        </div>
    </div>
}