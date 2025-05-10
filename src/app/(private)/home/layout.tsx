import { redirect } from 'next/navigation'
import React from 'react'

import { ClearCookies } from '@/components/ClearCookies'
import { Sidebar } from '@/components/Sidebar/Sidebar'
import { getServerSessionApp } from '@/lib'
import { hasUserAgreedWithLatestRegisterTherm } from '@/services/therms'
export default async function PrivateLayoutRoot({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSessionApp()

  if (!session) {
    return redirect('/')
  }

  const hasCurrentUserAgreedWithActiveRegisterTherm =
    await hasUserAgreedWithLatestRegisterTherm()

  if (!hasCurrentUserAgreedWithActiveRegisterTherm) {
    return <ClearCookies />
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 px-8 py-4 lg:ml-60">{children}</main>
    </div>
  )
}
