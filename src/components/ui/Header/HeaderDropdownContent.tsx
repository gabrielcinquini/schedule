'use client'

import React from 'react'

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { APP_ROUTES } from '@/routes/paths';
import { DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '../dropdown-menu';
import { LogOutIcon, LockIcon } from 'lucide-react';

export function HeaderDropdownContent() {
  const router = useRouter();

  return (
    <DropdownMenuContent className="w-56">
      <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <LogOutIcon className="mr-2 h-4 w-4" />
          <button className="flex w-full" onClick={() => signOut()}>
            Log out
          </button>
        </DropdownMenuItem>
        <DropdownMenuItem>
        <LockIcon className="mr-2 h-4 w-4" />
          <button className="flex w-full" onClick={() => router.push(APP_ROUTES.private.forgotPassword)}>
            Alterar minha senha
          </button>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  )
}
