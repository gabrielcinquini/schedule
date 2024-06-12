import { redirect } from 'next/navigation'
import React from 'react'

import { Header } from '@/components/Header/Header'
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
    <>
      <Header />
      {children}
    </>
  )
}
