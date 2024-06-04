import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getServerSessionApp } from "@/lib";
import { HeaderDropdownContent } from "./HeaderDropdownContent";
import { DropdownMenu, DropdownMenuTrigger } from "../dropdown-menu";
import { getInitials } from "@/utils/utils";
import { NavList } from "./NavList";

export async function Header() {
  const session = await getServerSessionApp();

  return (
    <header className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur p-2'>
      <div className="container flex items-center justify-between">
        <NavList />
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button>
                <Avatar>
                  <AvatarImage src="" alt="" />
                  <AvatarFallback>
                    {getInitials(session?.user?.name)}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <HeaderDropdownContent />
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
