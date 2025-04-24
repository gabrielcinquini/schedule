import { Metadata } from 'next'
import React from 'react'

import { BASE_TITLE } from '@/constants/title'

import { DashboardPatients } from './_components/DashBoardPatients'
import { HeaderPatients } from './_components/HeaderPatients'

export default async function PatientsPage() {
  return (
    <>
      <HeaderPatients />
      <DashboardPatients />
    </>
  )
}

export const metadata: Metadata = {
  title: `${BASE_TITLE} - Pacientes`,
}
