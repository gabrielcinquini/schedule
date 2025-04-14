'use client'

import React, { ReactNode } from 'react'

interface HeaderProps {
  title: string
  children: ReactNode
}

export function Widget({ title, children }: HeaderProps) {
  return (
    <div className="mb-12 flex justify-between border-b pb-4">
      <h1 className="text-3xl font-bold max-sm:hidden max-sm:text-xl">
        {title}
      </h1>
      {children}
    </div>
  )
}
