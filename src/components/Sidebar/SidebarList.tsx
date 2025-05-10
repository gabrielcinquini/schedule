'use client'

import clsx from 'clsx'
import {
  CalendarIcon,
  ClipboardIcon,
  LineChartIcon,
  LogOutIcon,
  UserIcon,
  UsersIcon,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { ReactElement } from 'react'

import { APP_ROUTES } from '@/routes/paths'

import { Button } from '../ui/button'

type LinkSidebarItem = {
  variant: 'link'
  link: string
}

type ButtonSidebarItem = {
  variant: 'button'
  onLogout: () => void
}

type SidebarItems = {
  icon: ReactElement
  label: string
} & (LinkSidebarItem | ButtonSidebarItem)

type SideBarContentList = {
  category: string
  items: SidebarItems[]
}

interface SidebarListProps {
  isSidebarOpen: boolean
}

export function SidebarList({ isSidebarOpen }: SidebarListProps) {
  const pathname = usePathname()

  const sidebarList: SideBarContentList[] = [
    {
      category: 'Sistema',
      items: [
        {
          variant: 'link',
          icon: <CalendarIcon size={18} />,
          label: 'Agenda',
          link: APP_ROUTES.private.schedule,
        },
        {
          variant: 'link',
          icon: <UsersIcon size={18} />,
          label: 'Pacientes',
          link: APP_ROUTES.private.patients,
        },
        {
          variant: 'link',
          icon: <ClipboardIcon size={18} />,
          label: 'Total',
          link: APP_ROUTES.private.total,
        },
        {
          variant: 'link',
          icon: <LineChartIcon size={18} />,
          label: 'Gráficos',
          link: APP_ROUTES.private.graph,
        },
      ],
    },
    {
      category: 'Usuário',
      items: [
        {
          variant: 'link',
          icon: <UserIcon size={18} />,
          label: 'Perfil',
          link: APP_ROUTES.private.profile,
        },
        {
          variant: 'button',
          icon: <LogOutIcon size={18} />,
          label: 'Sair',
          onLogout: () => {
            signOut()
          },
        },
      ],
    },
  ]

  return (
    <ul className="flex w-full flex-col space-y-6">
      {sidebarList.map((category) => (
        <li
          key={category.category}
          className={clsx(!isSidebarOpen && 'max-lg:hidden lg:block')}
        >
          <h3
            className={clsx(
              'px-2 text-sm font-semibold uppercase tracking-widest text-primary/70',
              !isSidebarOpen && 'hidden lg:block',
            )}
          >
            {category.category}
          </h3>
          <ul className="mt-2 space-y-1">
            {category.items.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.variant === 'link' ? item.link : '/'}
                  className={clsx(
                    'block',
                    item.variant === 'link' && pathname === item.link
                      ? 'text-blue-400'
                      : 'text-primary/70 hover:text-primary/80',
                  )}
                >
                  <Button
                    className={clsx(
                      'flex w-full gap-2',
                      isSidebarOpen
                        ? 'justify-start'
                        : 'justify-center lg:justify-start',
                    )}
                    variant="ghost"
                    onClick={
                      item.variant === 'button' ? item.onLogout : undefined
                    }
                  >
                    <span className="flex items-center justify-center">
                      {item.icon}
                    </span>
                    <span
                      className={clsx(
                        'transition-opacity duration-200',
                        !isSidebarOpen && 'hidden sm:hidden lg:block',
                      )}
                    >
                      {item.label}
                    </span>
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}
