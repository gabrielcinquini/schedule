
import { getServerSessionApp } from '@/lib';
import { redirect } from 'next/navigation';
import React from 'react'
import { HeaderPatients } from './_components/HeaderPatients';
import { DashboardPatients } from './_components/DashBoardPatients';
import { Header } from '@/components/ui/Header/Header';

export default async function PatientsPage() {
  const session = await getServerSessionApp();

  if(!session) {
    redirect('/')
  }

  return (
    <>
      <HeaderPatients />
      <DashboardPatients />
    </>
  )
}