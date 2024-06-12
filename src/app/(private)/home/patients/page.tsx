import React from 'react'

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
