import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";
import Link from "next/link";

export default function AppBar() {
    return (
        <div className="flex items-center justify-between bg-white p-4 w-4/5 mx-auto">
            <Link href="/">
                <h1 className="text-2xl font-black">Aproveita UFBA</h1>
            </Link>
            <div className="flex items-center gap-2">
                <span className="text-gray-600">Olá, fulano</span>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.pngs"/>
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </div>
        </div>
    );
}
