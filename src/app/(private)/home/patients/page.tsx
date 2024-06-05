import { redirect } from 'next/navigation'
import React from 'react'

import { getServerSessionApp } from '@/lib'

import { DashboardPatients } from './_components/DashBoardPatients'
import { HeaderPatients } from './_components/HeaderPatients'

export default async function PatientsPage() {
  const session = await getServerSessionApp()

  if (!session) {
    redirect('/')
  }

  return (
    <>
      <HeaderPatients />
      <DashboardPatients />
    </>
  )
}
