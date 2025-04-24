import { Metadata } from 'next'
import React from 'react'

import { BASE_TITLE } from '@/constants/title'

import { DashboardSchedule } from './_components/DashboardSchedule'
import { HeaderSchedule } from './_components/HeaderSchedule'

export default function HomePage() {
  return (
    <>
      <HeaderSchedule />
      <DashboardSchedule />
    </>
  )
}

export const metadata: Metadata = {
  title: `${BASE_TITLE} - Calendário`,
}
