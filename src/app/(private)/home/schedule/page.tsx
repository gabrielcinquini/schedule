import { redirect } from 'next/navigation'
import React from 'react'

import DashboardSchedule from '@/app/(private)/home/schedule/_components/DashboardSchedule'
import { getServerSessionApp } from '@/lib'

import { HeaderSchedule } from './_components/HeaderSchedule'

export default async function HomePage() {
  const session = await getServerSessionApp()

  if (!session) {
    redirect('/')
  }

  return (
    <>
      <HeaderSchedule />
      <DashboardSchedule />
    </>
  )
}
