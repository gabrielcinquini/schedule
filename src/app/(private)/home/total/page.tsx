import React from 'react'

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
