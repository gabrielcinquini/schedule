import React from 'react'

import { SidebarList } from './SidebarList'

export function Sidebar() {
  return (
    <aside className="h-screen flex-col border-r lg:flex">
      <nav className="flex justify-center text-clip p-4">
        <SidebarList />
      </nav>
    </aside>
  )
}
