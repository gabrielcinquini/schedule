'use client'

import clsx from 'clsx'
import { MenuIcon, XIcon } from 'lucide-react'
import { useState } from 'react'

import ModeToggle from '../ui/mode-toggle'
import { SidebarList } from './SidebarList'

export function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="relative sm:mr-8">
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className={clsx(
            'max-sm:absolute sm:fixed',
            'top-4',
            'lg:hidden',
            'left-4',
          )}
        >
          <MenuIcon className="h-6 w-6" />
        </button>
      )}
      <aside
        className={clsx(
          'fixed left-0 top-0 h-screen border-r bg-background p-4',
          'lg:w-60',
          isSidebarOpen ? 'w-60 translate-x-0' : 'w-0 -translate-x-full',
          'transition-transform duration-300 ease-in-out',
          'lg:translate-x-0',
        )}
      >
        {isSidebarOpen && (
          <button
            className="absolute right-2 top-2"
            onClick={() => setIsSidebarOpen(false)}
          >
            <XIcon className="h-4 w-4" />
          </button>
        )}
        <div className="flex h-full flex-col p-4">
          <nav>
            <SidebarList isSidebarOpen={isSidebarOpen} />
          </nav>
          {isSidebarOpen && (
            <div className="ml-auto mr-auto mt-auto">
              <ModeToggle />
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}
