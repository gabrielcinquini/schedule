'use client'

import clsx from 'clsx'
import { MenuIcon } from 'lucide-react'
import { useState } from 'react'

import { SidebarList } from './SidebarList'

export function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <aside
      className={clsx(
        'left-0 top-0 h-screen border-r transition-all duration-300',
        'lg:w-60',
        isSidebarOpen ? 'w-60' : 'w-16',
        'z-50',
      )}
    >
      <div className="flex h-full flex-col p-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="mb-8 flex items-center justify-center lg:hidden"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
        <nav>
          <SidebarList isSidebarOpen={isSidebarOpen} />
        </nav>
      </div>
    </aside>
  )
}
