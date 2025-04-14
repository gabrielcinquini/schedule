'use client'

import clsx from 'clsx'
import { Calendar, Clipboard, LogOut, User, Users } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { APP_ROUTES } from '@/routes/paths'

import { Button } from '../ui/button'

interface SidebarListProps {
  isSidebarOpen: boolean
}

export function SidebarList({ isSidebarOpen }: SidebarListProps) {
  const pathname = usePathname()

  const sidebarList = [
    {
      category: 'Sistema',
      items: [
        {
          variant: 'link',
          icon: <Calendar size={18} />,
          label: 'Agenda',
          link: APP_ROUTES.private.schedule,
        },
        {
          variant: 'link',
          icon: <Users size={18} />,
          label: 'Pacientes',
          link: APP_ROUTES.private.patients,
        },
        {
          variant: 'link',
          icon: <Clipboard size={18} />,
          label: 'Total',
          link: APP_ROUTES.private.total,
        },
      ],
    },
    {
      category: 'Usuário',
      items: [
        {
          variant: 'link',
          icon: <User size={18} />,
          label: 'Perfil',
          link: APP_ROUTES.private.profile,
        },
        {
          variant: 'button',
          icon: <LogOut size={18} />,
          label: 'Sair',
        },
      ],
    },
  ]

  return (
    <ul className="flex w-full flex-col space-y-6">
      {sidebarList.map((category) => (
        <li key={category.category}>
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
                {item.variant === 'link' && item.link ? (
                  <Link
                    href={item.link}
                    className={clsx(
                      'block',
                      pathname === item.link
                        ? 'text-red-400'
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
                    >
                      <span className="flex items-center justify-center">
                        {item.icon}
                      </span>
                      <span
                        className={clsx(
                          'transition-opacity duration-200',
                          !isSidebarOpen && 'hidden lg:block',
                        )}
                      >
                        {item.label}
                      </span>
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="ghost"
                    className={clsx(
                      'flex w-full gap-2 text-primary/70 hover:text-primary/80',
                      isSidebarOpen
                        ? 'justify-start'
                        : 'justify-center lg:justify-start',
                    )}
                  >
                    <span className="flex items-center justify-center">
                      {item.icon}
                    </span>
                    <span
                      className={clsx(
                        'transition-opacity duration-200',
                        !isSidebarOpen && 'hidden lg:block',
                      )}
                    >
                      {item.label}
                    </span>
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  )
}
