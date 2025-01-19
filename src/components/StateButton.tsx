'use client';

import { useFormStatus } from "react-dom";
import Spinner from "./Spinner";

export default function StateButton({children}:{children:React.ReactNode}){
    const {pending} = useFormStatus()
    if(pending){
        return <Spinner/>
    }
    return <button className="btn">{children}</button>
}
