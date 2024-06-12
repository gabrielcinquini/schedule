'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import { APP_ROUTES } from '@/routes/paths'

export function NavList() {
  const pathname = usePathname()

  const navItems = [
    { name: 'Agenda', path: APP_ROUTES.private.schedule },
    { name: 'Pacientes', path: APP_ROUTES.private.patients },
    { name: 'Total', path: APP_ROUTES.private.total },
  ]

  return (
    <nav>
      <ul className="flex gap-6">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              href={item.path}
              className={clsx(
                pathname === item.path
                  ? 'text-primary'
                  : 'text-primary/70 hover:text-primary/80',
              )}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
