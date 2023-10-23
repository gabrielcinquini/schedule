"use client"

import DashBoardTotal from '@/components/Total/DashBoardTotal';
import HeaderTotal from '@/components/Total/HeaderTotal'
import { useMe } from '@/hooks/useMe';
import React from 'react'

export default function page() {
  const { user } = useMe();
  if(!user) return <p>Loading...</p>
  
  return (
    <div>
      <HeaderTotal user={user} />
      <DashBoardTotal user={user}/>
    </div>
  )
}
