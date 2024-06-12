'use client'

import { LogOutIcon, UserIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import React from 'react'

import { APP_ROUTES } from '@/routes/paths'

import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu'

export function HeaderDropdownContent() {
  const router = useRouter()

  return (
    <DropdownMenuContent className="w-56">
      <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <button
            className="flex w-full items-center"
            onClick={() => router.push(APP_ROUTES.private.profile)}
          >
            <UserIcon className="mr-2 h-4 w-4" />
            Meu perfil
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <button
            className="flex w-full items-center"
            onClick={() => signOut()}
          >
            <LogOutIcon className="mr-2 h-4 w-4" />
            Log out
          </button>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  )
}
