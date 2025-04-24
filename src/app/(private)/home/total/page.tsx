import { Metadata } from 'next'
import React from 'react'

import { BASE_TITLE } from '@/constants/title'

import { DashBoardTotal } from './_components/DashBoardTotal'
import { HeaderTotal } from './_components/HeaderTotal'

export default async function TotalPage() {
  return (
    <>
      <HeaderTotal />
      <DashBoardTotal />
    </>
  )
}

export const metadata: Metadata = {
  title: `${BASE_TITLE} - Total`,
}
