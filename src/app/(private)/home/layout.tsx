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
    <div className="grid min-h-screen grid-cols-[280px_1fr]">
      <Sidebar />
      <main className="p-4">{children}</main>
    </div>
  )
}
