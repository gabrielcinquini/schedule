'use client'

import { Dashboard } from './Dashboard'
import { Header } from './Header'

export function Content() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Header />
      <Dashboard />
    </div>
  )
}
