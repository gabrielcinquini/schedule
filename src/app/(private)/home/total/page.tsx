import { getServerSessionApp } from '@/lib';
import { redirect } from 'next/navigation';
import React from 'react'
import { DashBoardTotal } from './_components/DashBoardTotal';
import { HeaderTotal } from './_components/HeaderTotal';

export default async function TotalPage() {
  const session = await getServerSessionApp();

  if(!session) {
    redirect('/')
  }
  
  return (
    <>
      <HeaderTotal />
      <DashBoardTotal/>
    </>
  )
}
