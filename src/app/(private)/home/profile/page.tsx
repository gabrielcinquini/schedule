import { redirect } from 'next/navigation'
import React from 'react'

import { getServerSessionApp } from '@/lib'

import { UpdateProfileForm } from './_components/update-profile-form'

export default async function UpdateProfilePage() {
  const session = await getServerSessionApp()
  if (!session) redirect('/')

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mx-auto">Olá {session.user?.name}</h1>
      <UpdateProfileForm />
    </div>
  )
}
