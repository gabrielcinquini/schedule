import React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getServerSessionApp } from '@/lib'
import { getInitials } from '@/utils/utils'

import { DropdownMenu, DropdownMenuTrigger } from '../ui/dropdown-menu'
import ModeToggle from '../ui/mode-toggle'
import { HeaderDropdownContent } from './HeaderDropdownContent'
import { NavList } from './NavList'

export async function Header() {
  const session = await getServerSessionApp()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 p-2 backdrop-blur">
      <div className="container flex items-center justify-between">
        <NavList />
        <div className="flex gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button>
                <Avatar>
                  <AvatarImage
                    src={session?.user?.image ? session?.user?.image : ''}
                    alt=""
                  />
                  <AvatarFallback>
                    {getInitials(session?.user?.name)}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <HeaderDropdownContent />
          </DropdownMenu>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
