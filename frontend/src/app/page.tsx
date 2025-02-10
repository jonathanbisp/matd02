import Image from "next/image";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {BookMarkedIcon, ClipboardPlusIcon, EyeIcon, ListTodoIcon, ShoppingCart, Table2Icon} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import React from "react";
import Link from "next/link";
import AppBar from "@/components/app-bar";


const menuItems = [
    { icon: ClipboardPlusIcon, title: "Criar nova solicitação", description: "Adicione uma nova solicitação de aproveitamento de horas", link: "/requests/new" },
    { icon: EyeIcon, title: "Minhas Solicitações", description: "Acompanhe todas as solicitações cadastradas", link: "/requests/my" },
    { icon: ListTodoIcon, title: "Solicitações", description: "Gestão de solicitações", link: "/requests/all" },
    { icon: BookMarkedIcon, title: "Cursos", description: "Gestão de cursos", link: "/" },
    { icon: Table2Icon, title: "Baremas", description: "Gestão de baremas", link: "/" },
];

const MenuItemCard = ({ icon: Icon, title, description, link }: any) => {
    return (
        <Link href={link}>
        <Card className="w-96 p-4 flex flex-row items-center shadow-md">
            <CardHeader className="pr-4">
                <Icon className="w-16 h-16 text-primary" />
            </CardHeader>
            <CardContent className="flex flex-col">
                <CardTitle className="text-lg font-semibold">{title}</CardTitle>
                <p className="text-sm text-gray-500">{description}</p>
            </CardContent>
        </Card>
        </Link>
    );
};

export default function Home() {
  return (
      <>
          <AppBar />

          <div
              className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
              <h1 className={"text-5xl font-bold font-mono"}>AproveitaUFBA</h1>
              <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-6 p-6">
                      {menuItems.map((item, index) => (
                          <MenuItemCard key={index} {...item} />
                      ))}
                  </div>
              </main>


          </div>
      </>
  );
}
