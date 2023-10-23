"use client"

import DashboardCadastro from '@/components/Cadastro/DashBoardCadastro';
import HeaderCadastro from '@/components/Cadastro/HeaderCadastro'
import { useMe } from '@/hooks/useMe';
import { usePatients } from '@/hooks/usePatients';
import { useStore } from '@/store';
import React from 'react'

export default function page() {
  const { user } = useMe();
  if(!user) return <p>Loading...</p>

  return (
    <div>
      <HeaderCadastro user={user}/>
      <DashboardCadastro />
    </div>
  )
}
