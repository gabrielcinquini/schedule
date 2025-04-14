import { redirect } from 'next/navigation'
import React from 'react'

import { Sidebar } from '@/components/Sidebar/Sidebar'
import { getServerSessionApp } from '@/lib'
export default async function PrivateLayoutRoot({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSessionApp()

  if (!session) {
    redirect('/')
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 px-8 py-4 max-lg:ml-16 lg:ml-60">{children}</main>
    </div>
  )
}
