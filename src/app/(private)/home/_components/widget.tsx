'use client'

import React, { ReactNode } from 'react'

interface HeaderProps {
  title: string
  children: ReactNode
}

export function Widget({ title, children }: HeaderProps) {
  return (
    <div className="mb-12 flex justify-between border-b pb-4 max-sm:flex-col max-sm:gap-4">
      <h1 className="text-3xl font-bold max-sm:text-center max-sm:text-3xl">
        {title}
      </h1>
      {children}
    </div>
  )
}
