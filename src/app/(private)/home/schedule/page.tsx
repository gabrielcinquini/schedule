import { redirect } from 'next/navigation'
import React from 'react'

import { getServerSessionApp } from '@/lib'

import { DashboardSchedule } from './_components/DashboardSchedule'
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
