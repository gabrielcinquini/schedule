'use client'

import clsx from 'clsx'
import { Calendar, Clipboard, LogOut, User, Users } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { APP_ROUTES } from '@/routes/paths'

import { Button } from '../ui/button'

export function SidebarList() {
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
    <ul className="flex w-full flex-col py-3">
      {sidebarList.map((category) => (
        <li key={category.category} className="mb-8">
          <h3 className="px-2 text-sm font-semibold uppercase tracking-widest text-primary/70">
            {category.category}
          </h3>
          <ul className="mt-2">
            {category.items.map((item) => (
              <li key={item.label}>
                {item.variant === 'link' && item.link ? (
                  <Link
                    href={item.link}
                    className={clsx(
                      pathname === item.link
                        ? 'text-red-400'
                        : 'text-primary/70',
                    )}
                  >
                    <Button
                      className="flex w-full justify-start gap-2"
                      variant="ghost"
                    >
                      {item.icon}
                      {item.label}
                    </Button>
                  </Link>
                ) : (
                  <Button
                    variant="ghost"
                    className={clsx(
                      'flex w-full justify-start gap-2',
                      'text-primary/70 hover:text-primary/80',
                    )}
                  >
                    {item.icon}
                    {item.label}
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
