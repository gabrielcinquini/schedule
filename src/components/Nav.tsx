import Link from 'next/link'
import React from 'react'

export default function Nav() {
  return (
    <nav className='flex gap-2 justify-between p-2'>
      <Link href="/home" className='bg-gray-700 p-2 rounded-md'>Agenda</Link>
      <Link href="/home/cadastro" className='bg-gray-700 p-2 rounded-md'>Pacientes</Link>
      <Link href="/home/total" className='bg-gray-700 p-2 rounded-md'>Total</Link>
    </nav>
  )
}
