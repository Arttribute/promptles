"use client";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";

import Link from "next/link";
import AccountMenu from "../account/account-menu";
import { Puzzle } from "lucide-react";

export default function AppBar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-10 p-2 bg-white border-b">
      <Menubar className="rounded-none border-none px-2 lg:px-4">
        <MenubarMenu>
          <div className=" lg:hidden"></div>
          <MenubarTrigger>
            <Puzzle className="w-5 h-5 mr-1 text-fuchsia-600 text-xs" />
            <div className="text-base font-bold">Promptles</div>
          </MenubarTrigger>
        </MenubarMenu>
        <div className="grow" />
        <div className="hidden lg:flex">
          <AccountMenu />
        </div>
      </Menubar>
    </div>
  );
}
